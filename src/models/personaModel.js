const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre no puede estar vacio."],
    trim: true,
    },
  apellido: {
    type: String,
    required: [true, "El apellido no puede estar vacio."],
    trim: true,
    },
  email: {
    type: String,
    required: [true, "El email es un campo obligatorio."],
    unique: true,
    lowercase: true, 
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es valido."]
    }
}, {
  timestamps: true
});

const Persona = mongoose.model('Persona', userSchema);

module.exports = Persona;
