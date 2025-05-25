const express = require("express");
const router = express.Router();
const {
  crearTurno,
  editarTurno,
  eliminarTurno,
  obtenerTurno,
  mostrarFormularioEdicion,
  mostrarConfirmacionEliminar,
  obtenerTurnosFiltrados
} = require("../controllers/consultaTurnosController");
const manejarConsultaTurnos = require("../middleware/filtroTurnos");

// Rutas para vistas
router.get("/crear", (req, res) => res.render("crearTurnos"));
router.get("/:id/editar", mostrarFormularioEdicion); // Muestra editarTurno.pug
router.get("/:id/eliminar", mostrarConfirmacionEliminar); // Muestra eliminarTurno.pug
router.get("/:id", obtenerTurno); // Muestra detalleTurno.pug

// Rutas CRUD
router.get("/", manejarConsultaTurnos);
router.post("/", crearTurno);
router.get("/:id", obtenerTurno);
router.put("/:id", editarTurno);
router.delete("/:id", eliminarTurno);
router.get("/", obtenerTurnosFiltrados);

module.exports = router;
