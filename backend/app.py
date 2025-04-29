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

load_dotenv()

# VARIABLES
pedidos = []        # Lista para guardar pedidos


# SEGURIDAD 
auth = HTTPBasicAuth()

USUARIOS = {
    "admin": os.getenv("ADMIN_PASS")  
}

@auth.verify_password
def verificar_contraseña(username, password):
    print( os.getenv("ADMIN_PASS"))
    if username in USUARIOS and USUARIOS[username] == password:
        return username

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



app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

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

    # enviar_mail(mensaje)
    # enviar_telegram(mensaje)

    pedidos.append({
        "id": len(pedidos) + 1,
        "direccion": direccion.strip(),
        "total": finalTotal,
        "telefono": phoneNumber,
        "metodo_envio": method,
        "metodo_pago": paymentMethod,
        "estado": "pendiente"
    })

    return jsonify({"success": True, "message": "Pedido procesado"}), 200

@app.route('/admin/pedidos')
@auth.login_required
def ver_pedidos():
    pendientes = [p for p in pedidos if p["estado"] == "pendiente"]
    enviados = [p for p in pedidos if p["estado"] == "enviado"]
    return render_template('pedidos.html', pendientes=pendientes, enviados=enviados)

@app.post('/admin/enviar/<int:pedido_id>')
@auth.login_required
def marcar_como_enviado(pedido_id):
    for pedido in pedidos:
        if pedido["id"] == pedido_id:
            pedido["estado"] = "enviado"
            break
    return redirect('/admin/pedidos')

@app.post('/admin/pendiente/<int:pedido_id>')
@auth.login_required
def marcar_como_pendiente(pedido_id):
    for pedido in pedidos:
        if pedido["id"] == pedido_id:
            pedido["estado"] = "pendiente"
            break
    return redirect('/admin/pedidos')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

