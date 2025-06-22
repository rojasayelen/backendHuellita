const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  tipo: { 
    type: String, 
    enum: ['entrada', 'salida', 'ajuste'], 
    required: true 
  },
  producto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  lote: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lote' 
  },
  cantidad: { type: Number, min: 0.01, required: true },
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  motivo: String,
  observaciones: String
}, { timestamps: true });

module.exports = mongoose.model('Movimiento', MovimientoSchema);