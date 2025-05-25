const fs = require("fs").promises;
const path = require("path");
const aplicarFiltros = require("../utils/filtrosTurnos");

const obtenerTurnosFiltrados = async (req, res) => {
	try {
		const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
		const data = await fs.readFile(rutaJSON, "utf-8");
		const turnos = JSON.parse(data);

		const filtros = req.query;
		const resultados = aplicarFiltros(turnos, filtros);

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

const mostrarTurnos = async (req, res) => {
	try {
		const rutaJSON = path.join(__dirname, "..", "data", "turnos.json");
		const data = await fs.readFile(rutaJSON, "utf-8");
		const turnos = JSON.parse(data);
		res.render("turnos", { turnos });
	} catch (error) {
		console.error("Error al mostrar los turnos:", error);
		res.status(500).send("Error al mostrar los turnos");
	}
};

module.exports = {
	obtenerTurnosFiltrados,
	mostrarTurnos,
};
