# app.py
# -*- coding: utf-8 -*-

import os
import re
from datetime import timedelta, datetime

from dotenv import load_dotenv

from flask import (
    Flask, request, jsonify, render_template, redirect, url_for, session, send_from_directory
)
from flask_cors import CORS
from flask_login import (
    LoginManager, UserMixin, login_user, login_required,
    current_user, logout_user
)
from flask_wtf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from flask_limiter import Limiter                          # ✅ Rate limiting
from flask_limiter.util import get_remote_address

from flask_talisman import Talisman                        # ✅ Cabeceras + HTTPS

import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import redis
import json


# -----------------------------------------------------------------------------
# Carga de entorno
# -----------------------------------------------------------------------------
load_dotenv()

# -----------------------------------------------------------------------------
# Redis
# -----------------------------------------------------------------------------
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)


# -----------------------------------------------------------------------------
# Seguridad / Auth (sesiones + hash)  ✅
# -----------------------------------------------------------------------------
ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASS_HASH = os.getenv("ADMIN_PASS_HASH")  # recomendado
ADMIN_PASS = os.getenv("ADMIN_PASS")            # solo si no hay hash

if not ADMIN_PASS_HASH and ADMIN_PASS:
    # Hasheamos en runtime (mejor usar ADMIN_PASS_HASH en .env)
    ADMIN_PASS_HASH = generate_password_hash(ADMIN_PASS)
    print("⚠️ ADMIN_PASS_HASH generado en runtime. Usa ADMIN_PASS_HASH en .env.")

# -----------------------------------------------------------------------------
# Flask app
# -----------------------------------------------------------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", os.urandom(32))
app.config["REMEMBER_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
# En producción, activá Secure (requiere HTTPS)
app.config["SESSION_COOKIE_SECURE"] = os.getenv("FORCE_HTTPS", "false").lower() == "true"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=8)

# CORS: solo frontend permitido ✅
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001")
CORS(
    app,
    supports_credentials=True,  # necesario solo para rutas que usan cookies (admin)
    origins=[
        frontend_url,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://mvp.com.ar",
        "https://mvp.com.ar"
    ]
)

# CSRF: solo si usás cookies (admin) ✅
csrf = CSRFProtect(app)

# Login manager (sesiones) ✅
login_manager = LoginManager(app)
login_manager.login_view = "login"

class AdminUser(UserMixin):
    def __init__(self, username):
        self.id = username

@login_manager.user_loader
def load_user(user_id):
    if user_id == ADMIN_USER:
        return AdminUser(user_id)
    return None

# Rate limiting ✅
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],
    storage_uri=os.getenv("LIMITER_STORAGE_URI", "memory://"),
)

# Cabeceras de seguridad + HTTPS ✅
force_https = os.getenv("FORCE_HTTPS", "false").lower() == "true"
# CSP None para no romper assets hasta que lo definas; mantiene HSTS, XFO, etc.
Talisman(
    app,
    force_https=force_https,
    content_security_policy=None,
    frame_options="SAMEORIGIN",
    strict_transport_security=True,
)

# -----------------------------------------------------------------------------
# Helpers de validación ✅
# -----------------------------------------------------------------------------
ALLOWED_METHODS = {"Take Away", "Delivery"}
PHONE_RE = re.compile(r"^\+?\d{6,15}$")
TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")  # "HH:MM" simple

def parse_money_to_int(raw):
    """
    Convierte '1.234,56' / '1234.56' / '123456' a centavos (int) o a entero
    según tu modelo. Aquí mantenemos entero tipo "$ 123.456" sin decimales.
    """
    s = str(raw)
    s = s.replace(".", "").replace(",", "")
    if not s.isdigit():
        raise ValueError("Monto inválido")
    return int(s)

def sanitize_str(s, min_len=1, max_len=180):
    if not isinstance(s, str):
        raise ValueError("Debe ser texto")
    s = s.strip()
    if not (min_len <= len(s) <= max_len):
        raise ValueError("Longitud inválida")
    return s

def validate_order_payload(data):
    method = sanitize_str(data.get("method", ""))
    if method not in ALLOWED_METHODS:
        raise ValueError("Método de envío inválido")

    paymentMethod = sanitize_str(data.get("paymentMethod", ""), 1, 60)

    address = sanitize_str(data.get("address", ""), 5, 200)

    phoneNumber = sanitize_str(data.get("phoneNumber", ""), 6, 30)
    if not PHONE_RE.match(phoneNumber.replace(" ", "")):
        raise ValueError("Número de teléfono inválido")

    finalTotal = parse_money_to_int(data.get("finalTotal"))
    if finalTotal <= 0 or finalTotal > 10**9:
        raise ValueError("Total fuera de rango")

    delivery_time = data.get("deliveryTime")
    if delivery_time:
        delivery_time = str(delivery_time).strip()
        if not TIME_RE.match(delivery_time):
            raise ValueError("Horario de entrega inválido")

    return {
        "method": method,
        "paymentMethod": paymentMethod,
        "address": address,
        "phoneNumber": phoneNumber,
        "finalTotal": finalTotal,
        "delivery_time": delivery_time or "",
    }

def validar_horario_entrega(hora_str, minimo="20:30"):
    """
    Devuelve un horario válido:
      - Si hora_str < mínimo → devuelve mínimo
      - Si hora_str >= mínimo → devuelve hora_str
      - Si hora_str es None o inválido → devuelve mínimo
    """
    hora_minima = datetime.strptime(minimo, "%H:%M")

    if not hora_str:
        return minimo

    try:
        hora_dt = datetime.strptime(hora_str, "%H:%M")
        if hora_dt < hora_minima:
            return minimo
        return hora_str
    except ValueError:
        return minimo

# -----------------------------------------------------------------------------
# Notificaciones
# -----------------------------------------------------------------------------
def enviar_telegram(mensaje):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    params = {"chat_id": chat_id, "text": mensaje}
    try:
        requests.get(url, params=params, timeout=10)
    except requests.RequestException:
        pass

def enviar_mail(cuerpo):
    try:
        mensaje = MIMEMultipart()
        mensaje["From"] = os.getenv("MAIL_SENDER")
        mensaje["To"] = os.getenv("MAIL_RECIEVER")
        mensaje["Subject"] = "ALERTA: Nuevo pedido"

        mensaje.attach(MIMEText(cuerpo, "plain"))

        servidor = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        servidor.starttls()
        user = os.getenv("MAIL_USER")
        passwr = os.getenv("MAIL_PASS")
        servidor.login(user, passwr)
        servidor.send_message(mensaje)
        servidor.quit()
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

# -----------------------------------------------------------------------------
# Persistencia de pedidos
# -----------------------------------------------------------------------------
def guardar_pedido(pedido):
    nuevo_id = r.incr("pedido:id")
    pedido["id"] = nuevo_id
    pedido["estado"] = "pendiente"
    r.hset(f"pedido:{nuevo_id}", mapping=pedido)
    r.rpush("pedidos", nuevo_id)

def obtener_pedidos_por_estado(estado):
    pedidos_ids = r.lrange("pedidos", 0, -1)
    pedidos_filtrados = []

    for pid in pedidos_ids:
        pedido = r.hgetall(f"pedido:{pid}")
        if pedido.get("estado") != estado:
            continue

        pedido["id"] = int(pid)

        # total numérico
        try:
            pedido["total"] = int(pedido["total"])
        except Exception:
            pedido["total"] = 0

        # detalle → parse JSON
        detalle_raw = pedido.get("detalle", "")
        try:
            pedido["detalle"] = json.loads(detalle_raw.replace("'", '"'))
        except Exception:
            pedido["detalle"] = []

        pedidos_filtrados.append(pedido)

    return pedidos_filtrados

# -----------------------------------------------------------------------------
# Imagenes - Configuración carpeta de uploads
# -----------------------------------------------------------------------------
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/mascota.ico')
def backend_favicon():
    return send_from_directory('static', 'mascota.ico', mimetype='image/vnd.microsoft.icon')

# -----------------------------------------------------------------------------
# Rutas públicas / API
# -----------------------------------------------------------------------------

# Estado tienda
@app.get("/status")
def get_status():
    return jsonify({"open": is_store_open()})

# -----------------------------------------------------------------------------
# Autenticación admin (sesiones + CSRF en formularios) ✅
# -----------------------------------------------------------------------------
@app.route("/api/login", methods=["GET", "POST"])
@limiter.limit("100/hour")
def login():
    if request.method == "GET":
        return render_template("login.html")
    
    username = ""
    password = ""

    if request.is_json:
        data = request.get_json(silent=True) or {}
        username = data.get("username", "").strip()
        password = data.get("password", "")
    else:
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

    if username == ADMIN_USER and ADMIN_PASS_HASH and check_password_hash(ADMIN_PASS_HASH, password):
        session.permanent = True
        login_user(AdminUser(username))
        
        # Si es una request JSON, devolver JSON en lugar de redirigir
        if request.is_json:
            return jsonify({"success": True, "message": "Login exitoso"}), 200
        else:
            return redirect(url_for("admin_dashboard"))

    if request.is_json:
        return {"error": "Credenciales inválidas"}, 401
    else:
        return render_template("login.html", error="Credenciales inválidas"), 401


@app.route("/api/admin/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

# -----------------------------------------------------------------------------
# Admin: pedidos
# -----------------------------------------------------------------------------

# Exentamos CSRF para API JSON sin cookies (no hace falta CSRF aquí) 
@csrf.exempt
@app.route('/api/admin/enviarpedido', methods=['POST'])
@limiter.limit("5/minute")
def enviar_pedido():
    data = request.get_json(silent=True) or {}

    try:
        payload = validate_order_payload(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Datos adicionales del pedido
    cart = data.get("cart", [])
    comments = data.get("comments", "").strip()
    username = data.get("username", "").strip()
    payload["delivery_time"] = validar_horario_entrega(payload.get("delivery_time"))

    # Texto del pedido
    mensaje = (
        f"🧾 Nuevo Pedido!\n"
        f"Cliente: {username or '—'}\n"
        f"Método de envío: {payload['method']}\n"
        f"Dirección: {payload['address']}\n"
        f"Teléfono: {payload['phoneNumber']}\n"
        f"Método de pago: {payload['paymentMethod']}\n"
        f"Entrega estimada: {payload['delivery_time'] or '-'}\n"
        f"Total: ${payload['finalTotal']:,}".replace(",", ".") + "\n"
    )

    # Detalle del carrito
    if isinstance(cart, list) and cart:
        mensaje += "\n🍔 *Detalle del pedido:*\n"
        for item in cart:
            nombre = item.get("name", "—")
            cantidad = item.get("quantity", 1)
            total = item.get("totalPrice", 0)
            extras = item.get("extras", [])
            removed = item.get("removed", [])

            mensaje += f"\n- {nombre} x{cantidad}  (${total:,})".replace(",", ".")
            if extras:
                extras_txt = ", ".join(f"{e[0]} x{e[1]}" for e in extras)
                mensaje += f"\n   + Extras: {extras_txt}"
            if removed:
                removed_txt = ", ".join(removed)
                mensaje += f"\n   - Sin: {removed_txt}"

    # Comentarios
    if comments:
        mensaje += f"\n\n💬 Comentarios: {comments}"

    # print("Mensaje de pedido:\n", mensaje)

    # Notificaciones
    enviar_mail(mensaje)
    enviar_telegram(mensaje)

    # Guardar en Redis
    guardar_pedido({
        "direccion": payload["address"],
        "total": payload["finalTotal"],
        "telefono": payload["phoneNumber"],
        "metodo_envio": payload["method"],
        "metodo_pago": payload["paymentMethod"],
        "tiempo_entrega": payload["delivery_time"],
        "cliente": username,
        "comentarios": comments,
        "detalle": str(cart),  
    })

    return jsonify({"success": True, "message": "Pedido procesado"}), 200

@app.route('/api/admin/pedidos')
@login_required
def ver_pedidos():
    pendientes = obtener_pedidos_por_estado("pendiente")
    enviados = obtener_pedidos_por_estado("enviado")
    return render_template('pedidos.html', pendientes=pendientes, enviados=enviados)

def actualizar_estado_pedido(pedido_id, nuevo_estado):
    clave = f"pedido:{pedido_id}"
    if r.exists(clave):
        r.hset(clave, "estado", nuevo_estado)

@app.post('/api/admin/enviar/<int:pedido_id>')
@login_required
def marcar_como_enviado(pedido_id):
    actualizar_estado_pedido(pedido_id, "enviado")
    return redirect('/api/admin/pedidos')

@app.post('/api/admin/pendiente/<int:pedido_id>')
@login_required
def marcar_como_pendiente(pedido_id):
    actualizar_estado_pedido(pedido_id, "pendiente")
    return redirect('/api/admin/pedidos')

# -----------------------------------------------------------------------------
# Admin: menú
# -----------------------------------------------------------------------------
@app.route('/api/admin/menu')
@login_required
def ver_menu():
    ids = r.lrange("products", 0, -1)
    productos = []
    for pid in ids:
        data = r.hgetall(f"product:{pid}")
        if data:
            data["id"] = int(pid)
            data["price_simple"] = int(data.get("price_simple", 0))
            data["price_double"] = int(data.get("price_double", 0))
            data["price_triple"] = int(data.get("price_triple", 0))
            data["removeOptions"] = r.lrange(f"removeOptions:{data['name']}", 0, -1)
            productos.append(data)
    return render_template("menu.html", productos=productos)

@app.route("/menu", methods=["GET"])
def obtener_menu_json():
    ids = r.lrange("products", 0, -1)
    productos = []
    for pid in ids:
        data = r.hgetall(f"product:{pid}")
        if data:
            data["id"] = int(pid)
            data["price_simple"] = int(data.get("price_simple", 0))
            data["price_double"] = int(data.get("price_double", 0))
            data["price_triple"] = int(data.get("price_triple", 0))
            data["removeOptions"] = r.lrange(f"removeOptions:{data['name']}", 0, -1)
            productos.append(data)
    return jsonify(productos)

@app.post('/admin/menu')
@login_required
def agregar_producto_form():
    try:
        name = sanitize_str(request.form.get("name"), 2, 80)
        description = sanitize_str(request.form.get("description"), 2, 400)
        price_simple = int(request.form.get("price_simple", "0"))
        price_double = int(request.form.get("price_double", "0"))
        price_triple = int(request.form.get("price_triple", "0"))

        # Procesar imagen subida
        file = request.files.get("image")
        if not file or file.filename == "":
            raise ValueError("Imagen requerida")
        if not allowed_file(file.filename):
            raise ValueError("Formato de imagen no permitido")

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        if min(price_simple, price_double, price_triple) < 0:
            raise ValueError("Precios inválidos")
    except ValueError as e:
        return f"Error de validación: {e}", 400

    pid = r.incr("product:id")
    r.rpush("products", pid)
    r.hset(f"product:{pid}", mapping={
        "name": name,
        "description": description,
        "price_simple": price_simple,
        "price_double": price_double,
        "price_triple": price_triple,
        "image": filename   # guardamos solo el nombre del archivo
    })

    remove_raw = request.form.get("removeOptions", "")
    for item in [x.strip() for x in remove_raw.split(",") if x.strip()]:
        r.rpush(f"removeOptions:{name}", item)

    return redirect("/api/admin/menu")

@app.post('/api/admin/menu/eliminar/<int:product_id>')
@login_required
def eliminar_producto_form(product_id):
    clave_producto = f"product:{product_id}"
    if not r.exists(clave_producto):
        return "Producto no encontrado", 404

    nombre = r.hget(clave_producto, "name")
    r.delete(clave_producto)
    r.lrem("products", 0, str(product_id))
    r.delete(f"removeOptions:{nombre}")

    return redirect("/api/admin/menu")

@app.route("/api/admin/menu/editar/<int:producto_id>", methods=["POST"])
@login_required
def editar_producto(producto_id):
    key = f"product:{producto_id}"
    if not r.exists(key):
        return "Producto no encontrado", 404

    try:
        description = sanitize_str(request.form["description"], 2, 400)
        price_simple = int(request.form["price_simple"])
        price_double = int(request.form["price_double"])
        price_triple = int(request.form["price_triple"])

        # Imagen: si se subió, reemplazamos
        file = request.files.get("image")
        if file and file.filename != "":
            if not allowed_file(file.filename):
                raise ValueError("Formato de imagen no permitido")
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            image = filename
        else:
            # mantener la existente
            image = r.hget(key, "image")

        if min(price_simple, price_double, price_triple) < 0:
            raise ValueError("Precios inválidos")
    except ValueError as e:
        return f"Error de validación: {e}", 400

    r.hset(key, mapping={
        "description": description,
        "price_simple": price_simple,
        "price_double": price_double,
        "price_triple": price_triple,
        "image": image
    })

    # Ingredientes
    name = sanitize_str(request.form.get("name", ""), 2, 80)
    r.delete(f"removeOptions:{name}")
    remove_options = request.form.get("removeOptions", "").split(",")
    clean_options = [opt.strip() for opt in remove_options if opt.strip()]
    if clean_options:
        r.rpush(f"removeOptions:{name}", *clean_options)

    return redirect("/api/admin/menu")

# -----------------------------------------------------------------------------
# Admin: extras
# -----------------------------------------------------------------------------
@app.route('/api/admin/extras')
@login_required
def ver_extras():
    ids = r.lrange("extras", 0, -1)
    extras = []
    for eid in ids:
        data = r.hgetall(f"extra:{eid}")
        if data:
            data["id"] = int(eid)
            data["price"] = int(data.get("price", 0))
            extras.append(data)
    return render_template("extras.html", extras=extras)

@app.route("/extras", methods=["GET"])
def obtener_extras_json():
    ids = r.lrange("extras", 0, -1)
    extras = []
    for eid in ids:
        data = r.hgetall(f"extra:{eid}")
        if data:
            data["id"] = int(eid)
            data["price"] = int(data.get("price", 0))
            extras.append(data)
    return jsonify(extras)

@app.post('/admin/extras')
@login_required
def agregar_extra_form():
    try:
        name = sanitize_str(request.form.get("name"), 2, 80)
        price = int(request.form.get("price", "0"))
        if price < 0:
            raise ValueError("Precio inválido")
    except ValueError as e:
        return f"Error de validación: {e}", 400

    if not all([name, price]):
        return "Faltan campos", 400
    
    eid = r.incr("extra:id")
    r.rpush("extras", eid)
    r.hset(f"extra:{eid}", mapping={"name": name, "price": price})
    return redirect("/api/admin/extras")

@app.post('/api/admin/extras/eliminar/<int:extra_id>')
@login_required
def eliminar_extra_form(extra_id):
    clave_extra = f"extra:{extra_id}"
    if not r.exists(clave_extra):
        return "Extra no encontrado", 404
    r.delete(clave_extra)
    r.lrem("extras", 0, str(extra_id))
    return redirect("/api/admin/extras")

@app.route("/api/admin/extras/editar/<int:extra_id>", methods=["POST"])
@login_required
def editar_extra(extra_id):
    key = f"extra:{extra_id}"
    if not r.exists(key):
        return "Extra no encontrado", 404
    try:
        name = sanitize_str(request.form["name"], 2, 80)
        price = int(request.form["price"])
        if price < 0:
            raise ValueError("Precio inválido")
    except ValueError as e:
        return f"Error de validación: {e}", 400

    r.hset(key, mapping={"name": name, "price": price})
    return redirect("/api/admin/extras")

# -----------------------------------------------------------------------------
# Estado de toma de pedidos
# -----------------------------------------------------------------------------
def is_store_open() -> bool:
    """Devuelve True si estamos aceptando pedidos."""
    value = r.get("store_open")
    # Si la clave no existe asumimos tienda abierta
    return value != "false"

def set_store_open(value: bool) -> None:
    r.set("store_open", "true" if value else "false")

@app.post("/status")
@login_required  # admin con sesión; protegido por CSRF del form
def set_status_api():
    data = request.get_json(silent=True) or {}
    if "open" not in data:
        return jsonify({"error": "Campo 'open' requerido"}), 400
    set_store_open(bool(data["open"]))
    return jsonify({"success": True, "open": is_store_open()})

@app.route("/api/admin/status", methods=["GET", "POST"])
@login_required
def admin_status():
    if request.method == "POST":
        nuevo_estado = request.form.get("open", "true") == "true"
        set_store_open(nuevo_estado)
        return redirect("/api/admin/status")
    return render_template("status.html", abierto=is_store_open())

# -----------------------------------------------------------------------------
# Admin dashboard
# -----------------------------------------------------------------------------
@app.route("/api/admin")
@login_required
def admin_dashboard():
    return render_template("admin.html")

# -----------------------------------------------------------------------------
# Errores y arranque
# -----------------------------------------------------------------------------
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Demasiadas solicitudes, intentá más tarde"}), 429

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Solicitud inválida"}), 400

if __name__ == '__main__':
    # En prod: usá un WSGI (gunicorn/uwsgi) detrás de Nginx con HTTPS.
    app.run(host='0.0.0.0', port=5000, debug=os.getenv("FLASK_DEBUG", "false").lower()=="true")
