// // server.js

// // 1. Importar las librerías necesarias
// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const methodOverride = require('method-override');

// // Importar lógica de negocio y configuración
// const connectDB = require('./src/config/db'); // Corregí la ruta a /src
// const userRoutes = require('./src/routes/userRouter'); // Corregí la ruta a /src
// const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter"); // Añadido
// const errorHandler = require('./src/middleware/errorHandler'); // Añadido

// // 2. Cargar las variables de entorno del archivo .env
// dotenv.config();

// // 3. Conectar a la base de datos
// connectDB();

// // 4. Crear la aplicación de Express
// const app = express();

// // 5. Middlewares
// app.use(express.json()); // Para procesar JSON
// app.use(express.urlencoded({ extended: true })); // Para procesar formularios
// app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// // Middleware para PUT/DELETE desde formularios
// app.use(
//   methodOverride(function (req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       const method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//     return null;
//   })
// );

// // 6. Configuración del Motor de Vistas (Pug)
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "src/views"));

// // 7. Rutas de la aplicación
// app.get("/", (req, res) => {
//   res.render("index", { title: "Huellitas Felices" }); // Modificado para usar tu vista
// });
// app.use('/usuarios', userRoutes);
// app.use("/turnos", consultaTurnosRouter); // Añadido

// // 8. Manejador de Errores (debe ir después de las rutas)
// app.use(errorHandler);

// // 9. Iniciar el servidor
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} en el puerto ${PORT}`);
// });
