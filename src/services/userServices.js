const Persona = require("../models/personaModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

// Función temporal para crear usuarios en archivo JSON
const createUserInJSON = async (userData) => {
  try {
    const { nombre, apellido, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    // Generar nuevo ID
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;

    const newUser = {
      id: newId,
      nombre,
      apellido,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    return newUser;
  } catch (error) {
    throw new Error(`Error creando usuario en JSON: ${error.message}`);
  }
};

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

// Función temporal para obtener usuarios desde archivo JSON
const getAllFromJSON = async () => {
  try {
    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    // Convertir formato para compatibilidad
    return users.map((user) => ({
      _id: user.id,
      datosPersonales: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      password: user.password,
    }));
  } catch (error) {
    throw new Error(`Error leyendo usuarios desde JSON: ${error.message}`);
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

// Función temporal para obtener usuario por email desde JSON
const getByEmailFromJSON = async (email) => {
  try {
    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    const user = users.find((u) => u.email === email);
    if (!user) return null;

    // Convertir formato para compatibilidad
    return {
      _id: user.id,
      datosPersonales: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      password: user.password,
    };
  } catch (error) {
    throw new Error(`Error buscando usuario por email: ${error.message}`);
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

// Función temporal para obtener usuario por ID desde JSON
const getByIdFromJSON = async (id) => {
  try {
    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    const user = users.find((u) => u.id === parseInt(id));
    if (!user) return null;

    // Convertir formato para compatibilidad
    return {
      _id: user.id,
      datosPersonales: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      password: user.password,
    };
  } catch (error) {
    throw new Error(`Error buscando usuario por ID: ${error.message}`);
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
const deleteById = async (id) => {
  try {
    const user = await User.findById(id).populate("datosPersonales");
    if (!user) return false;

    // Eliminar la persona asociada
    await Persona.findByIdAndDelete(user.datosPersonales._id);

    // Eliminar el usuario
    await User.findByIdAndDelete(id);

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
