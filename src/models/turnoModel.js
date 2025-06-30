const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  apellido: { type: String, required: true },
  nombre: { type: String, required: true },
  dni: { type: String, required: true },
  mascota: { type: String, required: true },
  especie: { type: String, required: true },
  raza: { type: String },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  tipoConsulta: { type: String, required: true },
  profesional: { type: String, required: true },
  estado: { type: String, default: 'pendiente' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Turno', turnoSchema);
