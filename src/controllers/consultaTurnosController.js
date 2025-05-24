const fs = require("fs").promises;
const path = require("path");

const obtenerTurnosFiltrados = async (req, res) => {
	try {
		const rutaJSON = path.join(__dirname, "..", "..", "data", "turnos.json");
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
			return res.status(404).json({
				mensaje: "No se encontraron turnos que coincidan con la búsqueda.",
			});
		}

		res.json(resultados);
	} catch (error) {
		console.error("Error al obtener turnos:", error);
		res.status(500).json({ error: "Error al procesar la solicitud" });
	}
};

//---------- FUNCION MOSTRAR LOS TURNOS (PUG) ---------------
const mostrarTurnos = async (req, res) => {
	try {
		const rutaJSON = path.join(__dirname, "..", "data","turnos.json");
		const data = await fs.readFile(rutaJSON, "utf-8");
		const turnos = JSON.parse(data);
		res.render("turnos", { turnos });
	} catch (error) {
		console.error("Error al mostrar los turnos:", error);
		res.status(500).send("Error al mostrar los turnos");
	}
};

// Exportar ambas funciones
module.exports = {
	obtenerTurnosFiltrados,
	mostrarTurnos,
};
