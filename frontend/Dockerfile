FROM node:23-alpine AS app

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias primero
COPY package*.json ./

# Instalación limpia
RUN npm install

# Luego copia el resto del código (evita copiar node_modules si existe en tu máquina)
COPY . .

# Construye la app (si aplica)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
