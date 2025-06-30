
const express = require("express");
const router = express.Router();
const {
	crearTurno,
	editarTurno,
	eliminarTurno,
	obtenerTurno,
	mostrarFormularioEdicion,
	mostrarConfirmacionEliminar,
	obtenerTurnosFiltrados,
} = require("../controllers/consultaTurnosController");
const manejarConsultaTurnos = require("../middleware/filtroTurnos");
const { authMiddleware } = require("../middleware/authMiddleware");

// Rutas para vistas
router.get("/nuevo", authMiddleware, (req, res) =>
	res.render("Turnos/crearTurnos")
);
router.get("/:id/editar", authMiddleware, mostrarFormularioEdicion); // Muestra editarTurno.pug
router.get("/:id/eliminar", authMiddleware, mostrarConfirmacionEliminar); // Muestra eliminarTurno.pug
router.get("/:id", authMiddleware, obtenerTurno); // Muestra detalleTurno.pug

// Rutas CRUD
router.get("/", authMiddleware, manejarConsultaTurnos);
router.post("/", authMiddleware, crearTurno);
//router.get("/:id", authMiddleware, obtenerTurno);
router.put("/:id", authMiddleware, editarTurno);
router.delete("/:id", authMiddleware, eliminarTurno);
router.get("/", authMiddleware, obtenerTurnosFiltrados);

module.exports = router;
