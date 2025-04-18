# .env
import os
from dotenv import load_dotenv

# API
from flask import Flask, request, jsonify
import requests

# Mail
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# FUNCIONES

def enviar_telegram():
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    mensaje = "¡Alerta! La página ha agregado productos."

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

@app.route('/enviarpedido', methods=['POST'])
def enviar_pedido():
    data = request.json

    # Datos esperados desde el frontend
    method = data.get('method')                # "Take Away" o "Delivery"
    paymentMethod = data.get('paymentMethod')  # "Efectivo" o "Transferencia"
    address = data.get('address') or ""
    floor = data.get('floor') or ""
    apartment = data.get('apartment') or ""
    finalTotal = data.get('finalTotal') or 0
    phoneNumber = data.get('phoneNumber')      # Ej: "541134567890"

    if not phoneNumber:
        return jsonify({"error": "Falta el número de teléfono"}), 400

    # Dirección formateada
    direccion = (
        "Sarmiento 251, Avellaneda" if method == "Take Away"
        else f"{address} {f'- Piso {floor}' if floor else ''} {f'- Depto {apartment}' if apartment else ''}"
    )

    # Mensaje final
    mensaje = (
        f"Nuevo Pedido!\n"
        f"Método de pago: {paymentMethod}\n"
        f"Método: {method}\n"
        f"Dirección: {direccion.strip()}\n"
        f"Total: ${int(finalTotal):,}".replace(",", ".")
    )

    print("Mensaje: " + mensaje)

    #enviar_telegram()
    enviar_mail(mensaje)

    return jsonify({"success": True, "message": "Pedido procesado"}), 200

    # hacer un try 
    # en caso de que falle que me envie a mi si fallo en algo




if __name__ == '__main__':
    app.run(debug=True)
