# MVP Burgers - Frontend

## Descripción

MVP Burgers es el frontend de un sistema de pedidos de hamburguesas automatizado, desarrollado en **React**. Permite a los usuarios realizar pedidos de manera sencilla y eficiente, con una interfaz amigable y moderna. Este frontend se conecta con el backend para gestionar los pedidos y mostrar la información relevante.

---

## Características

- **Interfaz interactiva**: Diseñada para facilitar la experiencia de compra.
- **Resumen de pedidos**: Muestra los detalles del pedido antes de confirmar la compra.
- **Selección de método de envío**: Permite elegir entre "Take Away" o "Delivery".
- **Confirmación de pedido**: Muestra el resumen final con el precio total y el método de pago seleccionado.
- **Integración con Google Calendar**: Permite agregar eventos al calendario para recordatorios.
- **Responsive**: Compatible con dispositivos móviles y de escritorio.

---

## Requisitos

- Docker
- Node.js
- npm o yarn

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://tu-repo.git
   cd MVP_BURGERS/myapp

2. Instala las dependencias:
   ```bash
    npm install

3. Para ejecutar el proyecto sin Docker:
   ```bash
    npm start

4. Ejecutar solo el frontend
   ```bash
   docker-compose up --build frontend
