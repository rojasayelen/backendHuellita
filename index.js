const express = require("express");
require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");

const app = express();

app.use(express.json()); //para parsear el json del body
app.use(express.urlencoded({ extended: true })); //para leer los datos del formulario

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

//Configuración de pug y carpeta de vistas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// Determinacion del puerto del servidor
const port = process.env.PORT || 3000;

//Definicion del servidor. ruta base de prueba
app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

// Importar el archivo de rutas de turnos
const consultaTurnosRouter = require("./src/routes/consultaTurnosRouter");
const getUsuarios = require("./src/routes/userRoute");
const postUsuarios = require("./src/routes/userRoute");
const deleteUsuarios = require("./src/routes/userRoute");

app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", getUsuarios);
app.use("/registroUser", postUsuarios);
app.use("/deleteUser", deleteUsuarios);

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});

app.use((req, res, next) => {
  console.log(`📦 Método: ${req.method} | Ruta: ${req.url}`);
  next();
});
