# Huellitas felices

Backend para sistema de gestión para negocios de petshop y veterinaría desarrollado con Node.js y Express.

## Descripción

Huellitas Felices Backend es un sistema de gestión para negocios de petshop y veterinaría, desarrollado con Node.js y Express, siguiendo un patrón de arquitectura MVC (Modelo-Vista-Controlador). El proyecto forma parte de un trabajo práctico para la materia de Desarrollo Web Backend.

## Información Técnica

- **Plataforma:** Node.js  
- **Framework:** Express.js  
- **Almacenamiento de datos:** Archivos JSON  
- **Motor de plantillas:** Pug  
- **Versión actual:** 1.0.0  
- **Puerto del servidor:** 3000  

## Estructura del Proyecto

```
backendHuellita/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/ 
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── views/
|__  index.js

```

## Endpoints API

### Usuarios

| Método | Ruta                | Descripción             | Parámetros de consulta | Cuerpo de solicitud         | Códigos de respuesta |
|--------|---------------------|-------------------------|------------------------|-----------------------------|----------------------|
| GET    | /usuarios       | Listar todos los usuarios | N/A      | N/A                         | 200, 404             |
| GET    | /usuarios/:id   | Obtener usuario por ID  | N/A                   | N/A                         | 200, 404             | (Pendiente)
| POST   | /usuarios       | Crear nuevo usuario     | N/A                   | {nombre, apellido, email, password}        | 201, 400             |
| DELETE | /usuarios/deleteUsuario/:id   | Eliminar usuario        | N/A                   | N/A                         | 200, 404, 400        |
| GET | /usuarios/admin  | Lista de todos los usuarios con opción de eliminar       | N/A                   | N/A                         | 200, 404, 400        |


### Rutas de Vistas

| Ruta                | Descripción                    | Método |
|---------------------|-------------------------------|--------|
| /usuarios           | Lista de usuarios             | GET    |
| /usuarios/admin     | Lista de todos los usuarios con opción de eliminar    | GET    |
| /usuarios/update | Formulario de edición         | PUT    |
| /usuarios/login         | Formulario de inicio de sesión| GET    |
| /usuarios/register      | Formulario de registro        | GET    |(pendiente)

### turnos

| Método | Ruta                | Descripción             | Parámetros de consulta | Cuerpo de solicitud         | Códigos de respuesta |
|--------|---------------------|-------------------------|------------------------|-----------------------------|----------------------|
| GET    | /turnos       | Listar todos los turnos | N/A     | N/A                         | 200, 404             |
| GET    | /turnos/:id   | Obtener turnos por ID  | N/A                   | N/A                         | 200, 404             | 
| POST   | /turnos       | Crear nuevo turno     | N/A                   | cliente(apellido,nombre,dni) mascota(nombre,especie,raza) fecha, hora, tipoConsulta, profesional, estado        | 201, 400             |
| DELETE | /turnos/:id   | Eliminar turno       | N/A                   | N/A                         | 200, 404, 400        |
| GET | /turnos/  | Lista de todos los turnos filtrados      | ?parametro=valor                  | N/A                         | 200, 404, 400        |
| PUT | /turnos/:id  | Editar turno     | N/A                  | N/A                         | 200, 404, 400        |


### Rutas de Vistas

| Ruta                | Descripción                    | Método |
|---------------------|-------------------------------|--------|
| turnos/crear           | formulario para crear nuevos turnos             | POST    |
| turnos/:id/editar     | formulario para editar un turno   | GET    |
| /turnos | lista de turnos      | GET    |
| /turnos/:id/eliminar/:id?_method=DELETE         | Lista actualizada de los turnos | DELETE    |

## Requisitos de Instalación y Ejecución

### Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)

### Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install
```

### Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000)
