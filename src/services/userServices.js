const Persona = require("../models/personaModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

const getAll = async () => {
  try {
    const usuarios = await User.find().populate("datosPersonales");
    return usuarios;
  } catch (error) {
    // Fallback a archivo JSON
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getAllFromJSON();
  }
};

// Obtener usuario por email
const getByEmail = async (email) => {
  try {
    const persona = await Persona.findOne({ email });
    if (!persona) return null;

    const user = await User.findOne({ datosPersonales: persona._id }).populate(
      "datosPersonales"
    );
    return user;
  } catch (error) {
    // Fallback a archivo JSON
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getByEmailFromJSON(email);
  }
};

// Obtener usuario por ID
const getById = async (id) => {
  try {
    const user = await User.findById(id).populate("datosPersonales");
    return user;
  } catch (error) {
    // Fallback a archivo JSON
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getByIdFromJSON(id);
  }
};

// Verificar credenciales de usuario
const checkCredentials = async (email, password) => {
  try {
    const user = await getByEmail(email);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? user : null;
  } catch (error) {
    throw error;
  }
};

// Actualizar usuario por email
const updateByEmail = async (email, updateData) => {
  try {
    const persona = await Persona.findOne({ email });
    if (!persona) return null;

    const updatedPersona = await Persona.findByIdAndUpdate(
      persona._id,
      updateData,
      { new: true }
    );

    const user = await User.findOne({
      datosPersonales: updatedPersona._id,
    }).populate("datosPersonales");
    return user;
  } catch (error) {
    throw error;
  }
};

// Eliminar usuario por ID
const deleteById = async (idAEliminar, idDeQuienElimina) => {
  const usuarioQueElimina = await User.findById(idDeQuienElimina);
    if (!usuarioQueElimina) {
        const error = new Error('Usuario solicitante no válido.');
        error.statusCode = 401; // Unauthorized
        throw error;
    }
    
    // Condición 1: Solo un 'admin' puede eliminar.
    if (!usuarioQueElimina.roles.includes('admin')) {
        const error = new Error('No tienes permisos de administrador para eliminar usuarios.');
        error.statusCode = 403; 
        throw error;
    }

    // Condición 2: El admin no puede eliminarse a sí mismo.
    if (idDeQuienElimina.toString() === idAEliminar.toString()) {
        const error = new Error('Un administrador no puede eliminarse a sí mismo.');
        error.statusCode = 400; // Bad Request
        throw error;
    }

    // Si todas las validaciones pasan, procedemos a buscar y eliminar.
    const usuarioAEliminar = await User.findById(idAEliminar);

    if (!usuarioAEliminar) {
        return false; 
    }

    try {
      await Persona.findByIdAndDelete(usuarioAEliminar.datosPersonales);
      await User.findByIdAndDelete(idAEliminar);
      return true; 
    } catch (error) {
      throw error;
    }
};

const create = async (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  // createUserInJSON(userData);
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
    await Persona.findByIdAndUpdate(usuario.datosPersonales._id, {
      nombre: updateData.nombre || usuario.datosPersonales.nombre,
      apellido: updateData.apellido || usuario.datosPersonales.apellido,
    });
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

  const usuario = await User.findOne({ datosPersonales: persona._id }).populate(
    "datosPersonales"
  );
  if (!usuario || !usuario.activo) return null;

  const match = await bcrypt.compare(password, usuario.password);
  return match ? usuario : null;
};

module.exports = {
  create,
  getAll,
  getByEmail,
  getById,
  checkCredentials,
  updateByEmail,
  deleteById,
  obtenerUsuarioPorId,
  actualizarUsuarioPorId,
  desactivarUsuario,
  reactivarUsuario,
  eliminarUsuarioFisicamente,
  verificarCredenciales,
};
