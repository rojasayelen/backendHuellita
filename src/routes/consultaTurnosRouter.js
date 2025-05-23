const express = require("express");
const router = express.Router();
const {
	obtenerTurnosFiltrados,
	mostrarTurnos,
} = require("../controllers/consultaTurnosController");

router.get("/api", obtenerTurnosFiltrados);

router.get("/", mostrarTurnos);

module.exports = router;
