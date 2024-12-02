# Proyecto: Prueba Nest Vue

<p align="center">
    <img src="frontend\public\Inicio.png" alt="Logo"  height=400>
</p>

Este proyecto es una aplicación completa que consta de un backend desarrollado con **NestJS** y **Prisma**, una base de datos **PostgreSQL**, y un frontend creado con **Nuxt 3**. Todos estos servicios se orquestan usando **Docker** para facilitar el despliegue y la administración de los contenedores.

## Descripción del Proyecto

La aplicación consiste en un sistema completo de autenticación y gestión de usuarios que incluye:
- Un formulario de registro con doble verificación y reglas estrictas para contraseñas, incluyendo el uso de mayúsculas, minúsculas, símbolos y una longitud de entre 10 y 15 caracteres.
- Un sistema de autenticación con **doble factor** (verificación en dos pasos) para mejorar la seguridad de los usuarios.
- Un **CRUD de usuarios** que permite registrar, ver, actualizar y eliminar usuarios.
- Un **dashboard** para la administración y visualización de usuarios.

El frontend y el backend se comunican a través de una API REST desarrollada en **NestJS**, y toda la información se almacena en una base de datos **PostgreSQL** utilizando **Prisma** como ORM.

## Tecnologías Utilizadas

### Backend: NestJS con Prisma y PostgreSQL
- **NestJS**: Framework progresivo para construir aplicaciones del lado del servidor utilizando TypeScript.
- **Prisma**: ORM para facilitar la interacción con la base de datos **PostgreSQL**.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar toda la información de la aplicación.

### Frontend: Nuxt 3
- **Nuxt 3**: Framework para aplicaciones web, basado en Vue.js, que facilita la construcción de aplicaciones del lado del cliente con SSR (Renderizado del Lado del Servidor).
- **Tailwind CSS**: Biblioteca de CSS para el diseño estilizado del frontend, ofreciendo una interfaz moderna y responsiva.

### Contenedores con Docker
- **Docker**: Utilizado para contenerizar y desplegar todos los componentes de la aplicación (frontend, backend y base de datos) de manera eficiente.


## Instrucciones de Configuración

Para ejecutar la aplicación localmente usando **Docker**, sigue los pasos a continuación:

1. Clona el repositorio en tu máquina local:

   ```sh
   git clone https://github.com/Abrahames0/Prueba-Nest-Vue
   cd Prueba-Nest-Vue
   ```

2. Asegúrate de tener **Docker** y **Docker Compose** instalados en tu máquina.

3. Construye y levanta todos los servicios usando el siguiente comando:

   ```sh
   docker compose -f DockerCompose.yml up -d
   ```

   Esto construirá los contenedores para el **backend**, **frontend**, y **PostgreSQL**, y los levantará en segundo plano.

4. Una vez que los contenedores estén corriendo, puedes acceder a los siguientes servicios:
   - **Frontend**: Disponible en [http://localhost:80](http://localhost:80)
   - **Backend API**: Disponible en [http://localhost:4000](http://localhost:4000)
   - **Base de Datos PostgreSQL**: Disponible en el puerto `5432`

## Funcionalidades del Proyecto

### Frontend
- **Página Inicial**: Contiene una bienvenida y una navegación para acceder al registro o login.
- **Registro de Usuarios**: Formulario para el registro de nuevos usuarios con validación de campos (nombre, correo, contraseña, etc.).
- **Login**: Página de inicio de sesión con validación de usuario y contraseña.
- **Verificación en Dos Pasos**: Funcionalidad para la verificación adicional mediante código enviado al correo electrónico.
- **Dashboard**: Panel principal donde los usuarios pueden gestionar su perfil y ver información general.

### Backend
- **API RESTful**: Proporciona los endpoints necesarios para el registro, autenticación y gestión de usuarios.
- **Notificación de Registro**: Envía un correo electrónico al usuario confirmando el registro exitoso o reportando problemas.
- **Logging de Actividades**: Registra en un log cada transacción realizada para asegurar trazabilidad.
- **Autenticación con Token Expirable**: El sistema de autenticación utiliza **JSON Web Tokens (JWT)** que expiran después de cierto tiempo, lo cual añade una capa de seguridad adicional.
- **Contraseñas Encriptadas**: Las contraseñas de los usuarios se encriptan antes de almacenarse en la base de datos, garantizando la privacidad y seguridad de la información.

## Dockerfiles y Despliegue

### Dockerfile del Backend
El backend se construye en dos etapas. La primera etapa instala las dependencias y transpila el código TypeScript a JavaScript. En la segunda etapa, se utiliza una imagen más ligera para contenerizar el backend en producción.

### Dockerfile del Frontend
El frontend se construye usando una imagen de **Node** para compilar el proyecto **Nuxt 3**, y luego se sirve la aplicación utilizando el comando correspondiente para producción.

### Docker Compose
El archivo `DockerCompose.yml` define tres servicios:
- **postgres**: Base de datos PostgreSQL para almacenar la información.
- **backend**: API desarrollada con **NestJS** que interactúa con PostgreSQL usando **Prisma**.
- **frontend**: Interfaz gráfica del usuario construida con **Nuxt 3**.

## Consideraciones Adicionales

- **Migraciones de Prisma**: Prisma se utiliza como ORM para manejar la base de datos, por lo que, antes de ejecutar la aplicación, debes correr las migraciones necesarias utilizando `npx prisma migrate dev` para crear las tablas en la base de datos.
- **Autenticación**: El proyecto utiliza autenticación JWT (JSON Web Token) para proteger ciertas rutas del backend. El token expira después de un tiempo determinado, obligando a los usuarios a autenticarse nuevamente cuando expire.
