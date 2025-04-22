# 🍔 MVP Burgers - Fullstack App (React + Flask)

Este proyecto contiene el frontend hecho en React y el backend en Python (Flask), organizados para ejecutarse de forma conjunta usando Docker.

---
<!--
## Estructura del proyecto
MVP_BURGERS/ 
│ 
├── backend/ # Aplicación Flask 
│ ├── app.py 
│ ├── requirements.txt 
│ └── Dockerfile 
│ ├── myapp/ # Aplicación React 
│ ├── src/ 
│ ├── public/ 
│ ├── package.json 
│ └── Dockerfile 
│ ├── docker-compose.yml 
└── README.md
-->

## Requisitos

- Docker
- Docker Compose
- Python 
- React


## Cómo levantar el proyecto

1. Cloná el repositorio:
   ```bash
   git clone https://tu-repo.git
   cd MVP_BURGERS
   docker-compose up --build

    En caso de solo querer levantar frontend o backend:
    - docker compose up --build backend
    - docker compose up --build frontend


## Acceso a las aplicaciones:

- Frontend (React): http://localhost:3000

- Backend (Flask): http://localhost:5000
