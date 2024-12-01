# Usa una imagen base ligera de Node.js
FROM node:18-alpine as builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos del proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY src ./src/

# Instala dependencias solo para la etapa de construcción
RUN npm install --production=false

# Genera el código de Prisma y transpila TypeScript a JavaScript
RUN npx prisma generate && npm run build

# Crear una imagen mínima para la ejecución
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia las dependencias de producción desde la etapa de construcción
COPY package*.json ./
RUN npm install --production

# Copia los archivos de la aplicación y las migraciones de Prisma
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto que usa tu aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
