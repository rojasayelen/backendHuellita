const fs = require("fs").promises;
const path = require("path");
const Turno = require("../models/turnoModel");

const TURNOS_JSON = path.join(__dirname, "..", "data", "turnos.json");

// Helper functions
const readTurnos = async () => {
  const data = await fs.readFile(TURNOS_JSON, "utf-8");
  return JSON.parse(data);
};

const writeTurnos = async (turnos) => {
  await fs.writeFile(TURNOS_JSON, JSON.stringify(turnos, null, 2));
};

// CRUD Operations
module.exports = {
  // Crear turno
  crearTurno: async (req, res) => {
    try {
      const turnos = await readTurnos();
      const nuevoTurno = new Turno({
        id: turnos.length + 1,
        cliente: {
          apellido: req.body.apellido,
          nombre: req.body.nombre,
          dni: req.body.dni,
        },
        mascota: {
          nombre: req.body.mascota,
          especie: req.body.especie,
          raza: req.body.raza,
        },
        fecha: req.body.fecha,
        hora: req.body.hora,
        tipoConsulta: req.body.tipoConsulta,
        profesional: req.body.profesional,
        estado: req.body.estado || "pendiente",
      });

      turnos.push(nuevoTurno);
      await writeTurnos(turnos);

      // Redirecciona después de crear
      res.redirect("/turnos");
    } catch (error) {
      console.error("Error al crear turno:", error);
      res.status(500).render("error", { mensaje: "Error al crear turno" });
    }
  },

  // Obtener y filtrar turnos (usado por el middleware)
  obtenerTurnosFiltrados: async (req, res) => {
    try {
      const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
      const data = await fs.readFile(rutaJSON, "utf-8");
      const turnos = JSON.parse(data);

      const {
        id,
        nombre,
        apellido,
        mascota,
        profesional,
        tipoConsulta,
        fecha,
        estado,
      } = req.query;
      let resultados = turnos;

      // -------------------- FILTROS DE TURNOS ---------------------------
      if (id) {
        resultados = resultados.filter((turno) => String(turno.id) === id);
      }

      if (nombre) {
        resultados = resultados.filter((turno) =>
          turno.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
      }

      if (apellido) {
        resultados = resultados.filter((turno) =>
          turno.apellido.toLowerCase().includes(apellido.toLowerCase())
        );
      }

      if (mascota) {
        resultados = resultados.filter((turno) =>
          turno.mascota.toLowerCase().includes(mascota.toLowerCase())
        );
      }

      if (profesional) {
        resultados = resultados.filter((turno) =>
          turno.profesional.toLowerCase().includes(profesional.toLowerCase())
        );
      }

      if (tipoConsulta) {
        resultados = resultados.filter((turno) =>
          turno.tipoConsulta.toLowerCase().includes(tipoConsulta.toLowerCase())
        );
      }

      if (fecha) {
        resultados = resultados.filter((turno) => turno.fecha.includes(fecha));
      }

      if (estado) {
        const estadoBool = estado === "true";
        resultados = resultados.filter((turno) => turno.estado === estadoBool);
      }

      // --------------------- CONTROL DE ERRORES ------------------------------
      if (resultados.length === 0) {
        return res.status(404).render("turnosFiltered", {
          mensaje: "No se encontraron turnos que coincidan con la búsqueda.",
        });
      }

      res.render("turnosFiltered", { turnos: resultados });
    } catch (error) {
      console.error("Error al obtener turnos:", error);
      res
        .status(500)
        .render("turnosFiltered", {
          mensaje: "Error al procesar la solicitud",
        });
    }
  },

  // Mostrar todos los turnos
  mostrarTurnos: async (req, res) => {
    try {
      const turnos = await readTurnos();
      res.render("turnos", { turnos });
    } catch (error) {
      console.error("Error al mostrar turnos:", error);
      res.status(500).render("error", { mensaje: "Error al mostrar turnos" });
    }
  },

  // Obtener un turno específico
  obtenerTurno: async (req, res) => {
    try {
      const turnos = await readTurnos();
      const turno = turnos.find((t) => t.id == req.params.id);

      if (!turno) {
        return res
          .status(404)
          .render("error", { mensaje: "Turno no encontrado" });
      }

      res.render("detalleTurno", { turno });
    } catch (error) {
      console.error("Error al obtener turno:", error);
      res.status(500).render("error", { mensaje: "Error al obtener turno" });
    }
  },

  // Editar turno
  editarTurno: async (req, res) => {
    try {
      const turnos = await readTurnos();
      const index = turnos.findIndex((t) => t.id == req.params.id);

      if (index == -1) {
        return res
          .status(404)
          .render("error", { mensaje: "Turno no encontrado" });
      }

      const turnoActualizado = {
        ...turnos[index],
        ...req.body,
        estado: req.body.estado || turnos[index].estado,
      };

      turnos[index] = turnoActualizado;
      await writeTurnos(turnos);

      res.redirect(`/turnos/${req.params.id.toString()}`);
    } catch (error) {
      console.error("Error al editar turno:", error);
      res.status(500).render("error", { mensaje: "Error al editar turno" });
    }
  },

  // Eliminar turno
  eliminarTurno: async (req, res) => {
    try {
      let turnos = await readTurnos();
      const turnoEliminado = turnos.find((t) => t.id == req.params.id);

      if (!turnoEliminado) {
        return res
          .status(404)
          .render("error", { mensaje: "Turno no encontrado" });
      }

      turnos = turnos.filter((t) => t.id !== req.params.id);
      await writeTurnos(turnos);

      res.redirect("/turnos");
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      res.status(500).render("error", { mensaje: "Error al eliminar turno" });
    }
  },

  // Para mostrar formulario de edición
  mostrarFormularioEdicion: async (req, res) => {
    try {
      const { id } = req.params;
      const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
      const data = await fs.readFile(rutaJSON, "utf-8");
      const turnos = JSON.parse(data);

      const turno = turnos.find((t) => t.id == id);
      if (!turno) {
        return res
          .status(404)
          .render("error", { mensaje: "Turno no encontrado" });
      }

      res.render("editarTurno", { turno });
    } catch (error) {
      res
        .status(500)
        .render("error", { mensaje: "Error al cargar formulario de edición" });
    }
  },

  // Para mostrar confirmación de eliminación
  mostrarConfirmacionEliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
      const data = await fs.readFile(rutaJSON, "utf-8");
      const turnos = JSON.parse(data);

      const turno = turnos.find((t) => t.id == id);
      if (!turno) {
        return res
          .status(404)
          .render("error", { mensaje: "Turno no encontrado" });
      }

      res.render("eliminarTurno", { 
      title: "Confirmar Eliminación",
      turno 
    });
    } catch (error) {
      res
        .status(500)
        .render("error", { mensaje: "Error al cargar confirmación" });
    }
  }
};
