# Imagen base
FROM node:20

# Setea el directorio de trabajo
WORKDIR /app

# Copia los archivos y paquetes
COPY package*.json ./
RUN npm install

# Copia el resto de la app
COPY . .

# Expone el puerto de desarrollo de React (3000)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
