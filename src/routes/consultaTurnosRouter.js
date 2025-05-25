const express = require("express");
const router = express.Router();

const {
	obtenerTurnosFiltrados,
	mostrarTurnos,
} = require("../controllers/consultaTurnosController");

router.get("/", async (req, res) => {
	const filtros = req.query;

	// Si hay algún filtro, devolvemos JSON filtrado
	if (Object.keys(filtros).length > 0) {
		return obtenerTurnosFiltrados(req, res);
	}

	// Si no hay filtros, mostramos la vista Pug con todos los turnos
	return mostrarTurnos(req, res);
});

module.exports = router;
