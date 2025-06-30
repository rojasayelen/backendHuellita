// userServices.js

const Persona = require("../models/personaModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

// --- FUNCIONES DE LECTURA
const getAll = async () => {
  try {
    const usuarios = await User.find().populate("datosPersonales");
    return usuarios;
  } catch (error) {
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getAllFromJSON();
  }
};

const getByEmail = async (email) => {
  try {
    const persona = await Persona.findOne({ email });
    if (!persona) return null;
    const user = await User.findOne({ datosPersonales: persona._id }).populate("datosPersonales");
    return user;
  } catch (error) {
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getByEmailFromJSON(email);
  }
};

const getById = async (id) => {
  try {
    const user = await User.findById(id).populate("datosPersonales");
    return user;
  } catch (error) {
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await getByIdFromJSON(id);
  }
};

const obtenerUsuarioPorId = async (id) => {
  return await User.findById(id).populate("datosPersonales");
};

// --- FUNCIÓN DE CREACIÓN 
const create = async (userData) => {
  const { nombre, apellido, email, password, rol } = userData;
  try {
    const personaExistente = await Persona.findOne({ email });
    if (personaExistente) {
      const error = new Error(`El email '${email}' ya está registrado.`);
      error.statusCode = 400;
      throw error;
    }
    const instanciaPersona = new Persona({ nombre, apellido, email });
    await instanciaPersona.save();
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

// --- FUNCIONES DE ACTUALIZACIÓN
const actualizarUsuarioPorId = async (id, updateData) => {
  const usuario = await User.findById(id).populate("datosPersonales");
  if (!usuario) return null;
  if (updateData.nombre || updateData.apellido) {
    await Persona.findByIdAndUpdate(usuario.datosPersonales._id, {
      nombre: updateData.nombre || usuario.datosPersonales.nombre,
      apellido: updateData.apellido || usuario.datosPersonales.apellido,
    });
  }
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate("datosPersonales");
};

/**
 * Desactiva un usuario, aplicando reglas de negocio de permisos.
 * @param {string} idADesactivar - El ID del usuario a desactivar.
 * @param {string} idDeQuienDesactiva - El ID del usuario que realiza la acción (debe ser admin).
 */
const desactivarUsuarioConPermisos = async (idADesactivar, idDeQuienDesactiva) => {
    const usuarioQueDesactiva = await User.findById(idDeQuienDesactiva);
    if (!usuarioQueDesactiva) {
        const error = new Error('Usuario solicitante no válido.');
        error.statusCode = 401; // Unauthorized
        throw error;
    }
    
    // Regla 1: Solo un 'admin' puede desactivar.
    if (!usuarioQueDesactiva.roles.includes('admin')) {
        const error = new Error('No tienes permisos de administrador para desactivar usuarios.');
        error.statusCode = 403; // Forbidden
        throw error;
    }

    // Regla 2: Un admin no puede desactivarse a sí mismo.
    if (idDeQuienDesactiva.toString() === idADesactivar.toString()) {
        const error = new Error('Un administrador no puede desactivarse a sí mismo.');
        error.statusCode = 400; // Bad Request
        throw error;
    }

    // Si las validaciones pasan, procedemos a desactivar.
    const usuarioDesactivado = await User.findByIdAndUpdate(
        idADesactivar,
        { $set: { activo: false } },
        { new: true }
    );
    
    if (!usuarioDesactivado) return null;

    return usuarioDesactivado;
};

const reactivarUsuario = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { activo: true } },
    { new: true }
  ).populate("datosPersonales");
};


/**
 * Elimina un usuario, aplicando reglas de negocio de permisos.
 * @param {string} idAEliminar - El ID del usuario a eliminar.
 * @param {string} idDeQuienElimina - El ID del usuario que realiza la acción (debe ser admin).
 */
const eliminarUsuarioConPermisos = async (idAEliminar, idDeQuienElimina) => {
    const usuarioQueElimina = await User.findById(idDeQuienElimina);
    if (!usuarioQueElimina) {
        const error = new Error('Usuario solicitante no válido.');
        error.statusCode = 401; // Unauthorized
        throw error;
    }
    
    // Regla 1: Solo un 'admin' puede eliminar.
    if (!usuarioQueElimina.roles.includes('admin')) {
        const error = new Error('No tienes permisos de administrador para eliminar usuarios.');
        error.statusCode = 403; // Forbidden
        throw error;
    }

    // Regla 2: Un admin no puede eliminarse a sí mismo.
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

//  FUNCIONES DE AUTENTICACIÓN 
const verificarCredenciales = async (email, password) => {
  const persona = await Persona.findOne({ email });
  if (!persona) return null;

  const usuario = await User.findOne({ datosPersonales: persona._id }).populate("datosPersonales");
  if (!usuario || !usuario.activo) return null; // Importante: no loguear usuarios inactivos

  const match = await bcrypt.compare(password, usuario.password);
  return match ? usuario : null;
};

// --- EXPORTACIONES ---
module.exports = {
  create,
  getAll,
  getByEmail,
  getById,
  obtenerUsuarioPorId,
  actualizarUsuarioPorId,
  verificarCredenciales,
  desactivarUsuarioConPermisos,
  eliminarUsuarioConPermisos,
  reactivarUsuario,
  deleteById: eliminarUsuarioConPermisos, 
};