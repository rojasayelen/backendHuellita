const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();

//Configuración de pug y carpeta de vistas
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Determinacion del puerto del servidor
const port = process.env.PORT || 3000;

//Definicion del servidor. ruta base de prueba
app.get("/", (req, res) => {
	res.send("Hola Mundo");
});

// Importar el archivo de rutas de turnos
const consultaTurnosRouter = require("./routes/consultaTurnosRouter");
app.use("/turnos", consultaTurnosRouter);

app.listen(port, () => {
	console.log(`Server corriendo en http://localhost:${port}`);
});
