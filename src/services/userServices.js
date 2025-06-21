const Persona = require("../models/personaModel");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');

// Crear usuario
const create = async (userData) => {
  const { nombre, apellido, email, password, rol } = userData;

  try {
    // Verificar si el email ya existe
    const personaExistente = await Persona.findOne({ email });
    if (personaExistente) {
      const error = new Error(`El email '${email}' ya está registrado.`);
      error.statusCode = 400;
      throw error;
    }

    const instanciaPersona = new Persona({ nombre, apellido, email });
    await instanciaPersona.save();

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      password: hashedPassword,
      datosPersonales: instanciaPersona._id,
      roles: rol ? [rol] : ["user"],
    });
    return nuevoUsuario;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los usuarios
const getAll = async () => {
  return await User.find().populate("datosPersonales");
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (id) => {
  return await User.findById(id).populate("datosPersonales");
};

// Actualizar usuario por ID
const actualizarUsuarioPorId = async (id, updateData) => {
  const usuario = await User.findById(id).populate("datosPersonales");
  if (!usuario) return null;

  // Actualizar datos personales
  if (updateData.nombre || updateData.apellido) {
    await Persona.findByIdAndUpdate(
      usuario.datosPersonales._id,
      {
        nombre: updateData.nombre || usuario.datosPersonales.nombre,
        apellido: updateData.apellido || usuario.datosPersonales.apellido
      }
    );
  }

  // Actualizar contraseña si se proporciona
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  // Actualizar usuario
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate("datosPersonales");
};

// Desactivar usuario
const desactivarUsuario = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { activo: false } },
    { new: true }
  ).populate("datosPersonales");
};

// Reactivar usuario
const reactivarUsuario = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { activo: true } },
    { new: true }
  ).populate("datosPersonales");
};

// Eliminación física
const eliminarUsuarioFisicamente = async (id) => {
  const usuario = await User.findById(id);
  if (!usuario) return null;
  
  await Persona.findByIdAndDelete(usuario.datosPersonales);
  return await User.findByIdAndDelete(id);
};

// Verificar credenciales
const verificarCredenciales = async (email, password) => {
  const persona = await Persona.findOne({ email });
  if (!persona) return null;
  
  const usuario = await User.findOne({ datosPersonales: persona._id }).populate("datosPersonales");
  if (!usuario || !usuario.activo) return null;
  
  const match = await bcrypt.compare(password, usuario.password);
  return match ? usuario : null;
};

module.exports = {
  create,
  getAll,
  obtenerUsuarioPorId,
  actualizarUsuarioPorId,
  desactivarUsuario,
  reactivarUsuario,
  eliminarUsuarioFisicamente,
  verificarCredenciales
};