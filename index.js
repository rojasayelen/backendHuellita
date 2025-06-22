const express = require("express");
const methodOverride = require('method-override');
const flash = require('connect-flash');
require("dotenv").config();
const path = require("path");
const connectDB = require("./src/config/db");
const session = require('express-session'); 

connectDB(); 

const app = express();

// Configuración de sesión (requerida para connect-flash)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Middleware connect-flash
app.use(flash());

// Middlewares
app.use(express.json()); //para parsear el json del body
app.use(express.urlencoded({ extended: true })); //para leer los datos del formulario

// Middleware para pasar variables comunes a las vistas
app.use((req, res, next) => {
  res.locals.user = req.user || { nombre: 'Usuario' };
  res.locals.activePath = req.path;
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success'),
    info: req.flash('info')
  };
  next();
});

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

// Configuración de pug y carpeta de vistas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));
// Archivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

// Determinación del puerto del servidor
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`Método: ${req.method} | Ruta: ${req.url}`);
  next();
});


// Ruta base de prueba
app.get("/", (req, res) => {
	res.render("dashboard");
});
app.get('/stock', (req, res) => {
  res.render('stock/dashboard');
});


// Importar routers
const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
const userRouter = require("./src/routes/userRouter");
const stockRouter = require('./src/routes/stockRouter');

// Usar routers
app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", userRouter);
app.use('/stock', stockRouter);


const errorHandler = require('./src/middleware/errorHandler');

app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});

