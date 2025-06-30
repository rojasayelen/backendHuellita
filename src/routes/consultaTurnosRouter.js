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
<<<<<<< HEAD
router.get("/nuevo", authMiddleware, (req, res) => res.render("crearTurnos"));
=======
router.get("/nuevo", authMiddleware, (req, res) => res.render("Turnos/crearTurnos"));
>>>>>>> 6332a168f928e8a45bfb40daea4fd951b234b530
router.get("/:id/editar", authMiddleware, mostrarFormularioEdicion); // Muestra editarTurno.pug
router.get("/:id/eliminar", authMiddleware, mostrarConfirmacionEliminar); // Muestra eliminarTurno.pug
router.get("/:id", authMiddleware, obtenerTurno); // Muestra detalleTurno.pug

// Rutas CRUD
router.get("/", authMiddleware, manejarConsultaTurnos);
router.post("/", authMiddleware, crearTurno);
router.get("/:id", authMiddleware, obtenerTurno);
router.put("/:id", authMiddleware, editarTurno);
router.delete("/:id", authMiddleware, eliminarTurno);
router.get("/", authMiddleware, obtenerTurnosFiltrados);

module.exports = router;
