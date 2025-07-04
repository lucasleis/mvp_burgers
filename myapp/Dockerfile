# Etapa 1: Build de la app
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor estático
FROM node:20

RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build

EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]
