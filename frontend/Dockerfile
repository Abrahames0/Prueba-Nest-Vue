# Utilizar una imagen base oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración y dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código del proyecto
COPY . /app

# Construir el proyecto Nuxt
RUN npm run build

# Exponer el puerto donde se ejecutará el servidor Nuxt
ENV HOST=0.0.0.0
EXPOSE 3000

# Comando para iniciar la aplicación
ENTRYPOINT [ "node", ".output/server/index.mjs" ]