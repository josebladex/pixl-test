FROM node:23-alpine AS app

WORKDIR /app

# Copiar primero los archivos de Prisma
COPY prisma ./prisma

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --unsafe-perm

# Copiar el resto de los archivos
COPY . .

# Verificar que schema.prisma esté presente (opcional, para depuración)
RUN ls -l /app/prisma/

# Comando para iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate dev --name dev_init && npx prisma generate && npx prisma db seed && npm run dev"]