const express = require("express");
const methodOverride = require('method-override');
require("dotenv").config();
const path = require("path");
const connectDB = require("./src/config/db");

connectDB(); 

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Método override para PUT/DELETE desde formularios
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
    return null;
  })
);

// Configuración de pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// Determinación del puerto
const port = process.env.PORT || 3000;

// Middleware de logging
app.use((req, res, next) => {
  console.log(`Método: ${req.method} | Ruta: ${req.url}`);
  next();
});


app.get("/", (req, res) => {
  res.render("index", { title: "Huellitas Felices" });
});

// Importar routers
const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
const userRouter = require("./src/routes/userRouter");

// Usar routers
app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", userRouter);

// Manejador de errores
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// // Iniciar servidor local solamente
// app.listen(port, () => {
//   console.log(`Server corriendo en http://localhost:${port}`);
// });

//Iniciar servidor en Vercel o en local
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server corriendo en http://localhost:${port}`);
    });
}