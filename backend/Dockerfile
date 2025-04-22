# Imagen base
FROM python:3.12.6

# Setea el directorio de trabajo
WORKDIR /app

# Copia requirements e instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de la app
COPY . .

# Expone el puerto de Flask (asumiendo que usás 5000)
EXPOSE 5000

# Comando para correr la app
CMD ["python", "app.py"]
