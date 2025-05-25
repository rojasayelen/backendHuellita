class Turno {
	constructor({
		id,
		cliente,
		mascota,
		fecha,
		hora,
		tipoConsulta,
		profesional,
	}) {
		this.id = id;
		this.apellido = cliente.apellido;
		this.nombre = cliente.nombre;
		this.dni = cliente.dni;
		this.mascota = mascota.nombre;
		this.especie = mascota.especie;
		this.raza = mascota.raza;
		this.fecha = fecha;
		this.hora = hora;
		this.tipoConsulta = tipoConsulta;
		this.profesional = profesional;
		this.estado = true;
	}
}

module.exports = Turno;
