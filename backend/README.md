# MVP Burgers - Backend

## Descripción

MVP Burgers es el backend de un sistema de pedidos de hamburguesas automatizado. Permite la gestión de pedidos y la comunicación con el frontend y otros servicios, como el envío de notificaciones por correo electrónico y Telegram. El backend está desarrollado en **Python (Flask)** y utiliza **Redis** para almacenar los pedidos.

---

## Características

- **Gestión de pedidos**: Permite registrar, consultar y modificar pedidos.
- **Notificaciones automáticas**: Envío de notificaciones por **Telegram** y **correo electrónico**.
- **Panel administrativo**: Visualización y gestión de pedidos pendientes y enviados.
- **Almacenamiento en Redis**: Utiliza Redis para almacenar los pedidos.
- **Autenticación básica**: Acceso al panel de administración protegido por autenticación básica.
- **Borrado automático de pedidos**: Los pedidos se eliminan automáticamente cada día a las 15:00.
- **Integración con Google Gemini**: Procesamiento de pedidos mediante la API de Google Gemini para interpretación de lenguaje natural.

---

## Requisitos

- Docker
- Docker Compose
- Python 3.x
- Redis

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://tu-repo.git
   cd MVP_BURGERS/backend

2. Instalar las dependencias:
   ```bash
    pip install -r requirements.txt

3. Configura el archivo .env

4. Levantar el servicio de backend con Docker Compose:
   ```bash
    docker-compose up --build backend
