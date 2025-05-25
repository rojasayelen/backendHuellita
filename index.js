const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/turnos", consultaTurnosRouter);
app.use("/usuarios", getUsuarios);
app.use("/registroUser", postUsuarios);

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});
