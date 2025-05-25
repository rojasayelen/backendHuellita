const { obtenerTurnosFiltrados, mostrarTurnos } = require("../controllers/consultaTurnosController");

const manejarConsultaTurnos = async (req, res, next) => {
  try {
    // Verifica si hay filtros y si el cliente acepta JSON
    const hayFiltros = Object.keys(req.query).length > 0;
    const aceptaJSON = req.accepts("json");
    
    if (hayFiltros && aceptaJSON) {
      return await obtenerTurnosFiltrados(req, res);
    }
    
    // Si no hay filtros o es una petición HTML
    return await mostrarTurnos(req, res);
  } catch (error) {
    next(error);
  }
};

module.exports = manejarConsultaTurnos;