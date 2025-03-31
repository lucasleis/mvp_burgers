import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GENAI_API_KEY = os.getenv("API_KEY_GEMINI")
if not GENAI_API_KEY:
    raise ValueError("La clave de API de Google Gemini no está configurada en el archivo .env")

genai.configure(api_key=GENAI_API_KEY)

menu = {
    "jordan simple": 9000,
    "jordan doble": 11000,
    "jordan triple": 13000,
    "ginobilli simple": 9000,
    "ginobilli doble": 11000,
    "ginobilli triple": 13000,
    "lebron simple": 10000,
    "lebron doble": 12000,
    "lebron triple": 14000,
    "black mamba simple": 10000,
    "black mamba doble": 12000,
    "black mamba triple": 14000,
}

extras = {
    "carne": 3000,
    "queso": 2000,
    "panceta": 2000,
}

def procesar_pedido(pedido):
    prompt = f"""
    Eres un asistente que ayuda a gestionar pedidos de hamburguesas.

    Menú de hamburguesas y extras:
    - Hamburguesas: {menu}
    - Extras: {extras}

    Un cliente ha pedido lo siguiente: "{pedido}".  
    Tu tarea es identificar los ítems del pedido, calcular el precio total y devolver un resumen en lenguaje natural.

    **Importante**: Devuelve SOLO la respuesta del pedido, sin código ni explicaciones.

    Ejemplo de respuesta:  
    "Has pedido:  
    - 1 x Jordan doble ($11000)  
    - 1 x Lebron simple ($10000) + 1 x queso ($2000)  
    El total es $23000."
    """
    
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    respuesta = model.generate_content(prompt)
    
    return respuesta.text

if __name__ == "__main__":
    pedido = "Quiero una lebron triple, una jordan con carne y un jordan doble con queso y panceta"
    rta = procesar_pedido(pedido)
    print(rta)
