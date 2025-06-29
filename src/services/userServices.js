const Persona = require("../models/personaModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

const create = async (userData) => {
  const { nombre, apellido, email, password } = userData;

  try {
    // Intentar usar MongoDB primero
    const hashedPassword = await bcrypt.hash(password, 10);

    const persona = new Persona({ nombre, apellido, email });
    const nuevoUsuario = await User.create({
      password: hashedPassword,
      datosPersonales: persona._id,
    });
    return nuevoUsuario;
  } catch (error) {
    // Si MongoDB falla, usar archivo JSON como fallback
    console.log("MongoDB no disponible, usando archivo JSON como fallback");
    return await createUserInJSON(userData);
  }
};

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

// const updateUserForm = async (__, res) => {
//   res.render("updateUserForm");
// };

// const updateUsuarios = async (req, res) => {
//   try {
//     const { nombre, apellido, email } = req.body;

//     if (!nombre || !apellido) {
//       return res.render("updateUserResponse", {
//         mensaje:
//           "Todos los campos son queredidos: nombre, apellido.",
//       });
//       s;
//     }

//     const usuarios = await leerUsuariosDesdeArchivo();

//     currentUser = usuarios.find((user) => user.email === email);

//     if (!currentUser) {
//       return res.render("updateUserResponse", {
//         mensaje: "Usuario inexistente",
//       });
//     }

//     currentUser.nombre = nombre;
//     currentUser.apellido = apellido;

//     const newUsuarios = usuarios.filter((user) => user.id !== currentUser.id);

//     newUsuarios.push(currentUser);

//     await fs.writeFile(rutaJSON, JSON.stringify(newUsuarios, null, 2), "utf-8");

//     const { password: _, ...usuarioCreadoSinPassword } = currentUser;

//     return res.render("updateUserResponse", {
//       usuario: usuarioCreadoSinPassword,
//     });
//   } catch (error) {
//     return res.render("updateUserResponse", {
//       mensaje: "Error en interno del servidor",
//     });
//   }
// };

// const getAdminUsuarios = async (req, res) => {
//   try {
//     const usuarios = await leerUsuariosDesdeArchivo();
//     res.render("adminUser", { usuarios }); // Renderiza vista adminUser.pug
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error al cargar la vista de administración" });
//   }
// };

// const deleteUsuarios = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const usuarios = await leerUsuariosDesdeArchivo();

//       const indiceUsuario = usuarios.findIndex(
//         (user) => user.id === parseInt(id)
//       );

//       if (indiceUsuario === -1) {

//         return res.status(404).render("adminUser", {
//           usuarios: usuarios,
//           error: "Usuario no encontrado",
//         });
//       }

//       usuarios.splice(indiceUsuario, 1);

//       await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");

//       res.redirect("/usuarios/admin");
//     } catch (error) {
//       console.error("Error al eliminar usuario:", error);
//       const usuarios = await leerUsuariosDesdeArchivo();
//       res.status(500).render("adminUser", {
//         usuarios: usuarios,
//         error: "Error interno del servidor al eliminar usuario",
//       });
//     }
//   };

// //#region  login
// const loginForm = async (__, res) => {
//   res.render("loginForm");
// };

// const loginUser = async (req, res) => {
//   const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");
//   const data = await fs.readFile(rutaJSON, "utf-8");
//   const usuarios = JSON.parse(data);

//   const { email, password } = req.body;

//   const user = usuarios.find(
//     (u) => u.email === email && u.password === password
//   );

//   if (user) {
//     return res.render("loginForm", { mensaje: "Login exitoso" });
//   } else {
//     return res.render("loginForm", {
//       mensaje: "Credenciales incorrectas",
//     });
//   }
// };
//#endregion

module.exports = {
  create,
  getAll,
  getByEmail,
  getById,
  checkCredentials,
  updateByEmail,
  deleteById,
};
