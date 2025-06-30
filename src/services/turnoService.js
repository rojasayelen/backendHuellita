
const Turno = require('../models/turnoModel.js');

// Servicio para obtener todos los turnos de la base de datos.

const getAll = async () => {
	// Esta es la lógica real que se ejecutará en producción
	const turnos = await Turno.findAll();
	return turnos;
};

/**
// Servicio para crear un nuevo turno en la base de datos.*/

const create = async (datosTurno) => {
	// Esta es la lógica real que se ejecutará en producción
	const nuevoTurno = await Turno.create(datosTurno);
	return nuevoTurno;
};

// Exportamos las funciones para que los controladores puedan usarlas
module.exports = {
	getAll,
	create,
};
