# 🍔 MVP Burgers - Fullstack App (React + Flask + Redis)

Este proyecto es una aplicación fullstack para gestión de pedidos de una hamburguesería. Incluye un frontend en React, un backend en Flask y una base de datos Redis. Todo corre en contenedores Docker para facilitar la ejecución y despliegue.

---

## 🔧 Tecnologías utilizadas

- Frontend: **React**
- Backend: **Flask (Python)**
- Base de datos: **Redis**
- Contenedores: **Docker + Docker Compose**
- Notificaciones: **Telegram** y **Email**
- Autenticación: **HTTP Basic Auth**

---

## 📦 Estructura del proyecto

```plaintext
MVP_BURGERS/
│
├── backend/          # Aplicación Flask
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── myapp/            # Aplicación React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## Requisitos

- Docker
- Docker Compose
- Python 3.X
- React
- Redis (se configura automáticamente con Docker)


## 🚀 Cómo buildear el proyecto

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/lucasleis/mvp_burgers.git
   cd MVP_BURGERS
   docker-compose up --build

En caso de solo querer levantar frontend o backend:
    ```bash
    - docker compose up --build backend
    - docker compose up --build frontend


## 🌐 Acceso a las aplicaciones

- Frontend (React): http://localhost:3000

- Backend (Flask): http://localhost:5000

- Panel de administración: http://localhost:5000/admin/pedidos (requiere autenticación)


---

## 🎯 Flujo de trabajo

1. El usuario realiza un pedido a través del frontend.

2. El frontend envía la información del pedido al backend.

3. El backend procesa y guarda el pedido en la base de datos Redis.

4. Se envía un mensaje de notificación por Telegram y correo electrónico.

5. El administrador puede ver los pedidos en el panel administrativo.

6. Los pedidos se gestionan y su estado se actualiza a "enviado" cuando se completa el proceso.

7. Todos los días, a las 15 horas, los pedidos se borran automáticamente para evitar la acumulación de datos innecesarios.
