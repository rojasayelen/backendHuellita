const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
const turnoRoutes = require("./routes/turnosRoutes");
const usuarioRoutes = require("./routes/usuariosRoutes");

app.use("/turnos", turnoRoutes);
app.use("/usuarios", usuarioRoutes);

// Otros middlewares si tenés

module.exports = app;
