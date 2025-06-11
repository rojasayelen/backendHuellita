const userService = require("../services/userService.js");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.getAll();
    res.render("usuarios", { usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const postUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }
    const nuevoUsuario = await userService.create(req.body);
    res.status(201).json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateUserForm = (req, res) => {
  res.render("updateUserForm");
};

const updateUsuarios = async (req, res) => {
    try {
        const { nombre, apellido, email } = req.body;
        if (!nombre || !apellido || !email) {
            return res.render("updateUserResponse", { mensaje: "Nombre, apellido y email son requeridos." });
        }
        const usuarioActualizado = await userService.updateByEmail(email, { nombre, apellido });
        if (!usuarioActualizado) {
            return res.render("updateUserResponse", { mensaje: "Usuario inexistente." });
        }
        return res.render("updateUserResponse", { usuario: usuarioActualizado });
    } catch (error) {
        return res.render("updateUserResponse", { mensaje: "Error interno del servidor." });
    }
};

const getAdminUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.getAll();
    res.render("adminUser", { usuarios });
  } catch (error) {
    res.status(500).json({ error: "Error al cargar la vista de administración." });
  }
};

const deleteUsuarios = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const fueEliminado = await userService.deleteById(id);
        if (!fueEliminado) {
             // Si no se encontró, podrías querer mostrar un error en la vista admin.
             const usuarios = await userService.getAll();
             return res.status(404).render("adminUser", { 
                 usuarios: usuarios, 
                 error: "Usuario no encontrado",
             });
        }
        res.redirect("/usuarios/admin");
    } catch (error) {
        // Manejo de error si la eliminación falla por otra razón
        res.status(500).send("Error al eliminar el usuario");
    }
};

const loginForm = (req, res) => {
  res.render("loginForm");
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.checkCredentials(email, password);
    if (user) {
        return res.render("loginForm", { mensaje: "Login exitoso" });
    }
    return res.render("loginForm", { mensaje: "Credenciales incorrectas" });
};

module.exports = {
  getAdminUsuarios,
  getUsuarios,
  postUsuarios,
  updateUserForm,
  updateUsuarios,
  deleteUsuarios,
  loginForm,
  loginUser,
};