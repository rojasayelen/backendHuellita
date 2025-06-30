const turnosMock = [
	{
		_id: "1",
		apellido: "Gonzalez",
		nombre: "Ana",
		dni: "12345678",
		mascota: "Firulais",
		especie: "Perro",
		raza: "Labrador",
		fecha: "2025-07-10",
		hora: "10:00",
		tipoConsulta: "Vacunación",
		profesional: "Dra. López",
		estado: "pendiente",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// Constructor mock para new Turno()
function Turno(data) {
	Object.assign(this, data);
}

// Agregamos método save() en el prototype
Turno.prototype.save = jest.fn(function () {
	// Simula guardar el turno agregándolo al array
	turnosMock.push(this);
	return Promise.resolve(this);
});

// Métodos estáticos mockeados
Turno.find = jest.fn(() => {
	return {
		lean: jest.fn().mockResolvedValue(turnosMock),
	};
});

Turno.findById = jest.fn((id) => {
	const turno = turnosMock.find((t) => t._id === id);
	return {
		lean: jest.fn().mockResolvedValue(turno || null),
	};
});

Turno.findByIdAndUpdate = jest.fn((id, update) => {
	let turno = turnosMock.find((t) => t._id === id);
	if (turno) {
		Object.assign(turno, update);
		return Promise.resolve(turno);
	}
	return Promise.resolve(null);
});

Turno.findByIdAndDelete = jest.fn((id) => {
	const index = turnosMock.findIndex((t) => t._id === id);
	if (index !== -1) {
		turnosMock.splice(index, 1);
		return Promise.resolve(true);
	}
	return Promise.resolve(null);
});

module.exports = Turno;
