const express = require("express");
const methodOverride = require('method-override');
require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.json());//para parsear el json del body
app.use(express.urlencoded({ extended: true }));//para leer los datos del formulario
// Configurar method-override
app.use(methodOverride('_method')); // Esto permite usar ?_method=PUT en los formularios

// Configuración de pug y carpeta de vistas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// Determinación del puerto del servidor
const port = process.env.PORT || 3000;

// Ruta base de prueba
app.get("/", (req, res) => {
	res.send("Hola Mundo");
});

// Importar routers
const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
const getUsuarios = require("./src/routes/userRoute");
const postUsuarios = require("./src/routes/userRoute");

// Usar routers
app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", getUsuarios);
app.use("/registroUser", postUsuarios);

const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
	console.log(`Server corriendo en http://localhost:${port}`);
});