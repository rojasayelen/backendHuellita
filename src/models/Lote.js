const mongoose = require('mongoose');

const LoteSchema = new mongoose.Schema({
  producto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  codigoLote: { type: String, required: true },
  cantidad: { type: Number, min: 0, required: true },
  fechaVencimiento: { type: Date, required: true },
  fechaIngreso: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Lote', LoteSchema);