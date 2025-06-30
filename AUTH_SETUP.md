# Configuración de Autenticación JWT

## Descripción

Este sistema implementa autenticación JWT (JSON Web Tokens) en una aplicación Express que renderiza vistas con Pug. La autenticación funciona tanto con cookies (para vistas renderizadas) como con tokens en headers (para peticiones AJAX).

## Características Implementadas

### 🔐 Servicio de Autenticación (`src/services/authService.js`)

- Generación de tokens JWT
- Verificación de tokens
- Autenticación de usuarios con bcrypt
- Validación de credenciales

### 🛡️ Middleware de Autenticación (`src/middleware/authMiddleware.js`)

- `authMiddleware`: Protege rutas y redirige al login si no hay token
- `optionalAuthMiddleware`: Verifica autenticación sin redirigir

### 🎨 Frontend JavaScript (`src/views/auth.js`)

- Gestión de tokens en sessionStorage
- Interceptación automática de peticiones fetch
- UI dinámica basada en estado de autenticación

### 🍪 Manejo de Cookies

- Tokens almacenados en cookies httpOnly
- Configuración segura para producción
- Limpieza automática de cookies expiradas

## Configuración Requerida

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion
NODE_ENV=development
PORT=3000
```

### 2. Dependencias Instaladas

```bash
npm install cookie-parser bcrypt jsonwebtoken
```

## Flujo de Autenticación

### Login

1. Usuario envía credenciales
2. Servidor verifica con bcrypt
3. Se genera token JWT
4. Token se almacena en cookie httpOnly
5. Para peticiones AJAX, también se devuelve en JSON

### Protección de Rutas

1. Middleware verifica token en cookies/headers
2. Si válido: agrega `req.user` y continúa
3. Si inválido: redirige a `/login`

### Logout

1. Limpia cookie del token
2. Redirige a página de login

## Uso en el Código

### Proteger una Ruta

```javascript
const { authMiddleware } = require("./src/middleware/authMiddleware");

app.get("/ruta-protegida", authMiddleware, (req, res) => {
  // req.user contiene la información del usuario autenticado
  res.render("vista", { user: req.user });
});
```

### Acceder al Usuario en Vistas Pug

```pug
if user
  p Bienvenido, #{user.nombre} #{user.apellido}
  a(href="/logout") Cerrar Sesión
```

### Usar en JavaScript Frontend

```javascript
// Verificar si está autenticado
if (authManager.isAuthenticated()) {
  const user = authManager.getUser();
  console.log("Usuario:", user);
}

// Hacer logout
authManager.logout();
```

## Estructura de Archivos

```
src/
├── services/
│   ├── authService.js          # Lógica de autenticación
│   └── userServices.js         # Servicios de usuario (actualizado)
├── middleware/
│   └── authMiddleware.js       # Middleware de autenticación
├── controllers/
│   └── userController.js       # Controlador actualizado
├── views/
│   ├── auth.js                 # Script de autenticación frontend
│   ├── loginForm.pug           # Vista de login actualizada
│   └── dashboard.pug           # Dashboard con info de usuario
└── config/
    └── config.js               # Configuración temporal
```

## Seguridad

### Cookies

- `httpOnly`: Previene acceso desde JavaScript
- `secure`: Solo HTTPS en producción
- `sameSite: 'strict'`: Previene CSRF
- `maxAge`: Expiración de 24 horas

### Tokens JWT

- Firma con clave secreta
- Expiración configurable
- Payload mínimo (solo datos necesarios)

### Contraseñas

- Hasheadas con bcrypt (salt rounds: 10)
- Nunca se almacenan en texto plano

## Próximos Pasos

1. **Crear archivo .env** con las variables de entorno
2. **Configurar base de datos** si no está conectada
3. **Crear usuarios de prueba** para probar la autenticación
4. **Probar el flujo completo** de login/logout
5. **Implementar registro de usuarios** si es necesario

## Notas Importantes

- En producción, cambiar `JWT_SECRET` por una clave segura
- Habilitar `secure: true` en cookies para HTTPS
- Considerar implementar refresh tokens para mayor seguridad
- Agregar rate limiting para prevenir ataques de fuerza bruta
