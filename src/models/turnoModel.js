class Turno {
  constructor({
    id,
    cliente = {},
    mascota = {},
    fecha,
    hora,
    tipoConsulta,
    profesional,
    estado = "pendiente" // Cambiado de boolean a string para coincidir con las vistas
  }) {
    this.id = id;
    this.apellido = cliente.apellido || "";
    this.nombre = cliente.nombre || "";
    this.dni = cliente.dni || "";
    this.mascota = mascota.nombre || "";
    this.especie = mascota.especie || "";
    this.raza = mascota.raza || "";
    this.fecha = fecha;
    this.hora = hora;
    this.tipoConsulta = tipoConsulta || "";
    this.profesional = profesional;
    this.estado = estado;
  }
}

module.exports = Turno;