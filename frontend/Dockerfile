FROM node:23-alpine AS app
WORKDIR /app
COPY prisma ./prisma
COPY package*.json ./
RUN npm install --unsafe-perm
COPY . .
RUN ls -l /app/prisma/
CMD ["sh", "-c", "npx prisma migrate dev --name dev_init && npx prisma generate && npx prisma db seed && npm run dev"]