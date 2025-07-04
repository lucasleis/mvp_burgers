# .env
import os
from dotenv import load_dotenv

# API
from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
import requests

# Mail
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# BD
import redis


load_dotenv()


# BD
redis_host = os.getenv("REDIS_HOST", "localhost")                           # Busca la var en .env y si no existe levanta en localhost 
r = redis.Redis(host=redis_host, port=6379, decode_responses=True)          # Conexión al Redis del contenedor Docker
# r.set("prueba", "Hola mundo")
# print(r.get("prueba"))


# SEGURIDAD 
auth = HTTPBasicAuth()

USUARIOS = {
    "admin": os.getenv("ADMIN_PASS")  
}


# FUNCIONES

def enviar_telegram(mensaje):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    mensaje = mensaje

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    params = {"chat_id": chat_id, "text": mensaje}

    response = requests.get(url, params=params)
    if response.status_code == 200:
        print("Mensaje enviado")
    else:
        print(f"Error al enviar mensaje: {response.status_code} - {response.text}")


def enviar_mail(cuerpo):
    try:
        mensaje = MIMEMultipart()
        mensaje["From"] = os.getenv("MAIL_SENDER")
        mensaje["To"] = os.getenv("MAIL_RECIEVER")
        mensaje["Subject"] = "ALERTA: La página web ha cambiado"

        # Cuerpo del correo: acá usamos el texto recibido como argumento
        mensaje.attach(MIMEText(cuerpo, "plain"))

        # Conexión al servidor SMTP
        servidor = smtplib.SMTP("smtp.gmail.com", 587)
        servidor.starttls()
        user = os.getenv("MAIL_USER")
        passwr = os.getenv("MAIL_PASS")
        servidor.login(user, passwr)
        servidor.send_message(mensaje)
        servidor.quit()

        print("Correo de notificacion enviado exitosamente.")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")


@auth.verify_password
def verificar_contraseña(username, password):
    if username in USUARIOS and USUARIOS[username] == password:
        return username

# FUNCIONES PARA BD

def guardar_pedido(pedido):
    nuevo_id = r.incr("pedido:id")  # ID incremental
    pedido["id"] = nuevo_id
    pedido["estado"] = "pendiente"
    r.hset(f"pedido:{nuevo_id}", mapping=pedido)
    r.rpush("pedidos", nuevo_id)

def obtener_pedidos_por_estado(estado):
    pedidos_ids = r.lrange("pedidos", 0, -1)
    pedidos_filtrados = []
    for pid in pedidos_ids:
        pedido = r.hgetall(f"pedido:{pid}")
        if pedido.get("estado") == estado:
            pedido["id"] = int(pid)
            pedido["total"] = int(pedido["total"])  # convertir a int para render
            pedidos_filtrados.append(pedido)
    return pedidos_filtrados


frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001")

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[frontend_url])
#CORS(app, supports_credentials=True, origins=["http://localhost:3001"])


@app.route('/enviarpedido', methods=['POST'])
def enviar_pedido():
    data = request.json

    method = data.get('method')
    paymentMethod = data.get('paymentMethod')
    direccion = data.get('address')
    finalTotal_raw = data.get('finalTotal')
    phoneNumber = data.get('phoneNumber')

    # Validaciones básicas
    if not phoneNumber:
        return jsonify({"error": "Falta el número de teléfono"}), 400
    if not direccion:
        return jsonify({"error": "Falta la dirección de envío"}), 400
    if not finalTotal_raw:
        return jsonify({"error": "Falta el precio del pedido"}), 400

    # Limpieza y conversión de finalTotal
    try:
        finalTotal = int(str(finalTotal_raw).replace(",", "").replace(".", ""))
    except ValueError:
        return jsonify({"error": "El total no es un número válido"}), 400

    mensaje = (
        f"Nuevo Pedido!\n"
        f"Método de pago: {paymentMethod}\n"
        f"Método de envio: {method}\n"
        f"Dirección: {direccion.strip()}\n"
        f"Numero: {phoneNumber}\n"
        f"Total: ${finalTotal:,}".replace(",", ".")
    )

    print("Mensaje: " + mensaje)

    enviar_mail(mensaje)
    enviar_telegram(mensaje)

    guardar_pedido({
        "direccion": direccion.strip(),
        "total": finalTotal,
        "telefono": phoneNumber,
        "metodo_envio": method,
        "metodo_pago": paymentMethod
    })

    return jsonify({"success": True, "message": "Pedido procesado"}), 200


@app.route('/admin/pedidos')
@auth.login_required
def ver_pedidos():
    pendientes = obtener_pedidos_por_estado("pendiente")
    enviados = obtener_pedidos_por_estado("enviado")
    return render_template('pedidos.html', pendientes=pendientes, enviados=enviados)


def actualizar_estado_pedido(pedido_id, nuevo_estado):
    clave = f"pedido:{pedido_id}"
    if r.exists(clave):
        r.hset(clave, "estado", nuevo_estado)

@app.post('/admin/enviar/<int:pedido_id>')
@auth.login_required
def marcar_como_enviado(pedido_id):
    actualizar_estado_pedido(pedido_id, "enviado")
    return redirect('/admin/pedidos')

@app.post('/admin/pendiente/<int:pedido_id>')
@auth.login_required
def marcar_como_pendiente(pedido_id):
    actualizar_estado_pedido(pedido_id, "pendiente")
    return redirect('/admin/pedidos')


### Menu ###
@app.route('/admin/menu')
@auth.login_required
def ver_menu():
    ids = r.lrange("products", 0, -1)
    productos = []

    for pid in ids:
        data = r.hgetall(f"product:{pid}")
        if data:
            data["id"] = int(pid)
            # Nuevos campos de precios por tipo
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
@auth.login_required
def agregar_producto_form():
    name = request.form.get("name")
    description = request.form.get("description")
    price_simple = request.form.get("price_simple")
    price_double = request.form.get("price_double")
    price_triple = request.form.get("price_triple")
    image = request.form.get("image")
    remove_raw = request.form.get("removeOptions", "")

    if not all([name, description, price_simple, price_double, price_triple, image]):
        return "Faltan campos", 400

    pid = r.incr("product:id")
    r.rpush("products", pid)

    r.hset(f"product:{pid}", mapping={
        "name": name,
        "description": description,
        "price_simple": price_simple,
        "price_double": price_double,
        "price_triple": price_triple,
        "image": image
    })

    for item in [x.strip() for x in remove_raw.split(",") if x.strip()]:
        r.rpush(f"removeOptions:{name}", item)

    return redirect("/admin/menu")

@app.post('/admin/menu/eliminar/<int:product_id>')
@auth.login_required
def eliminar_producto_form(product_id):
    clave_producto = f"product:{product_id}"

    if not r.exists(clave_producto):
        return "Producto no encontrado", 404

    nombre = r.hget(clave_producto, "name")
    r.delete(clave_producto)
    r.lrem("products", 0, str(product_id))
    r.delete(f"removeOptions:{nombre}")

    return redirect("/admin/menu")

@app.route("/admin/menu/editar/<int:producto_id>", methods=["POST"])
def editar_producto(producto_id):
    key = f"product:{producto_id}"
    if not r.exists(key):
        return "Producto no encontrado", 404

    r.hset(key, mapping={
        "description": request.form["description"],
        "price_simple": int(request.form["price_simple"]),
        "price_double": int(request.form["price_double"]),
        "price_triple": int(request.form["price_triple"]),
        "image": request.form["image"]
    })

    # Actualizar ingredientes a quitar
    r.delete(f"removeOptions:{request.form['name']}")
    remove_options = request.form["removeOptions"].split(",")
    clean_options = [opt.strip() for opt in remove_options if opt.strip()]
    if clean_options:
        r.rpush(f"removeOptions:{request.form['name']}", *clean_options)

    return redirect("/admin/menu")




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

