const Turno = require("../models/turnoModel");
const mongoose = require("mongoose");

module.exports = {
  // Crear turno
  crearTurno: async (req, res) => {
    try {
      const turno = new Turno({
        apellido: req.body.apellido,
        nombre: req.body.nombre,
        dni: req.body.dni,
        mascota: req.body.mascota,
        especie: req.body.especie,
        raza: req.body.raza,
        fecha: req.body.fecha,
        hora: req.body.hora,
        tipoConsulta: req.body.tipoConsulta,
        profesional: req.body.profesional,
        estado: req.body.estado || "pendiente"
      });

      await turno.save();
      res.redirect("/turnos");
    } catch (error) {
      console.error("Error al crear turno:", error);
      res.status(500).render("error", { mensaje: "Error al crear turno" });
    }
  },

  // Obtener y filtrar turnos
  obtenerTurnosFiltrados: async (req, res) => {
    try {
      const {
        id,
        nombre,
        apellido,
        mascota,
        profesional,
        tipoConsulta,
        fecha,
        estado
      } = req.query;

      const filtro = {};

      if (id && mongoose.Types.ObjectId.isValid(id.trim())) {
        filtro._id = id.trim();
      }

      if (nombre) {
        filtro.nombre = new RegExp(nombre.trim(), "i");
      }

      if (apellido) {
        filtro.apellido = new RegExp(apellido.trim(), "i");
      }

      if (mascota) {
        filtro.mascota = new RegExp(mascota.trim(), "i");
      }

      if (profesional) {
        filtro.profesional = new RegExp(profesional.trim(), "i");
      }

      if (tipoConsulta) {
        filtro.tipoConsulta = new RegExp(tipoConsulta.trim(), "i");
      }

      if (fecha) {
        filtro.fecha = new RegExp(fecha.trim(), "i");
      }

      if (estado) {
        filtro.estado = estado.trim().toLowerCase();
      }

      const turnos = await Turno.find(filtro).lean();

      if (turnos.length === 0) {
        return res.status(404).render("Turnos/turnosFiltered", {
          mensaje: "No se encontraron turnos que coincidan con la búsqueda.",
          turnos: [],
          filters: req.query
        });
      }

      res.render("Turnos/turnosFiltered", {
        turnos,
        filters: req.query
      });

    } catch (error) {
      console.error("Error al obtener turnos:", error);
      res.status(500).render("Turnos/turnosFiltered", {
        mensaje: "Error al procesar la solicitud.",
        turnos: [],
        filters: req.query
      });
    }
  },

  // Mostrar todos los turnos
  mostrarTurnos: async (req, res) => {
    try {
      const turnos = await Turno.find().lean();
      res.render("Turnos/turnos", { turnos });
    } catch (error) {
      console.error("Error al mostrar turnos:", error);
      res.status(500).render("error", { mensaje: "Error al mostrar turnos" });
    }
  },

  // Obtener un turno por ID
  obtenerTurno: async (req, res) => {
    try {
      const turno = await Turno.findById(req.params.id).lean();
      if (!turno) {
        return res.status(404).render("error", { mensaje: "Turno no encontrado" });
      }
      res.render("Turnos/detalleTurno", { turno });
    } catch (error) {
      console.error("Error al obtener turno:", error);
      res.status(500).render("error", { mensaje: "Error al obtener turno" });
    }
  },

  // Editar turno
  editarTurno: async (req, res) => {
    try {
      const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!turno) {
        return res.status(404).render("error", { mensaje: "Turno no encontrado" });
      }
      res.redirect(`/turnos/${req.params.id}`);
    } catch (error) {
      console.error("Error al editar turno:", error);
      res.status(500).render("error", { mensaje: "Error al editar turno" });
    }
  },

  // Eliminar turno
  eliminarTurno: async (req, res) => {
    try {
      await Turno.findByIdAndDelete(req.params.id);
      res.redirect("/turnos");
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      res.status(500).render("error", { mensaje: "Error al eliminar turno" });
    }
  },

  // Formulario de edición
  mostrarFormularioEdicion: async (req, res) => {
    try {
      const turno = await Turno.findById(req.params.id).lean();
      if (!turno) {
        return res.status(404).render("error", { mensaje: "Turno no encontrado" });
      }
      res.render("Turnos/editarTurno", { turno });
    } catch (error) {
      res.status(500).render("error", { mensaje: "Error al cargar formulario de edición" });
    }
  },

  // Confirmación de eliminación
  mostrarConfirmacionEliminar: async (req, res) => {
    try {
<<<<<<< HEAD
      const { id } = req.params;
      const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
      const data = await fs.readFile(rutaJSON, "utf-8");
      const turnos = JSON.parse(data);

      const turno = turnos.find((t) => t.id == id);
=======
      const turno = await Turno.findById(req.params.id).lean();
>>>>>>> 6332a168f928e8a45bfb40daea4fd951b234b530
      if (!turno) {
        return res.status(404).render("error", { mensaje: "Turno no encontrado" });
      }
<<<<<<< HEAD

      res.render("eliminarTurno", { 
      title: "Confirmar Eliminación",
      turno 
    });
=======
      res.render("Turnos/eliminarTurno", {
        title: "Confirmar Eliminación",
        turno
      });
>>>>>>> 6332a168f928e8a45bfb40daea4fd951b234b530
    } catch (error) {
      res.status(500).render("error", { mensaje: "Error al cargar confirmación" });
    }
  }
};
