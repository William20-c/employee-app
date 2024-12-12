# Despliegue de la aplicación de React

## Requisitos previos

* Docker instalado en tu sistema

## Construir la imagen de Docker

1. Abre una terminal y navega hasta el directorio raíz de tu proyecto.
2. Ejecuta el comando `docker build -t employeeapp .` para construir la imagen de Docker.

## Ejecutar el contenedor

1. Ejecuta el comando `docker run -p 5173:5173 employeeapp` para iniciar un contenedor desde la imagen que acabas de construir.
2. Abre un navegador web y accede a `http://localhost:5173` para ver tu aplicación en acción.

## Notas

* Asegúrate de que el puerto 5173 esté disponible en tu sistema.
