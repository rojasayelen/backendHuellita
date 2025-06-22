const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: String,
  categoria: { 
    type: String, 
    enum: ['medicamento', 'alimento', 'accesorio', 'higiene'],
    required: true 
  },
  stockMinimo: { type: Number, default: 0 },
  proveedor: String,
  precio: { type: Number, min: 0 },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);