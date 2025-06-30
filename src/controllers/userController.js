// userController.js

const userService = require("../services/userServices");
const authService = require("../services/authService");

// Vista única de usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.getAll();
    res.render("usuarios", {
      usuarios,
      // Pasamos el usuario logueado a la vista para poder comparar IDs
      currentUser: req.user, 
      mensaje: req.query.mensaje,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error: "Error al cargar los usuarios" });
  }
};

// Formulario de creación
const createUserForm = (req, res) => {
  res.render("createUser");
};

// Crear nuevo usuario
const postUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).render("error", { error: "Todos los campos son requeridos." });
    }
    await userService.create(req.body);
    res.redirect("/usuarios?mensaje=Usuario creado exitosamente");
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { error: error.message });
  }
};

// Formulario de actualización
const updateUserForm = async (req, res) => {
  try {
    const usuario = await userService.obtenerUsuarioPorId(req.params.id);
    res.render("actualizarUsuario", { usuario });
  } catch (error) {
    res.status(500).render("error", { error: "Error al cargar formulario" });
  }
};

// Actualizar usuario
const updateUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = await userService.actualizarUsuarioPorId(id, req.body);
    if (!usuarioActualizado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado");
    }
    res.redirect("/usuarios?mensaje=Usuario actualizado exitosamente");
  } catch (error) {
    res.redirect(`/usuarios?mensaje=Error al actualizar: ${encodeURIComponent(error.message)}`);
  }
};

// --- MÉTODOS DE GESTIÓN DE ESTADO Y ELIMINACIÓN (MODIFICADOS) ---

// Desactivar usuario
const desactivarUsuario = async (req, res) => {
  try {
    const idADesactivar = req.params.id;
    const idDeQuienDesactiva = req.user.userId; // Obtenido del token

    const usuarioActualizado = await userService.desactivarUsuarioConPermisos(
      idADesactivar,
      idDeQuienDesactiva
    );

    if (!usuarioActualizado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado para desactivar");
    }
    res.redirect("/usuarios?mensaje=Usuario desactivado exitosamente");
  } catch (error) {
    // Redirigir con el mensaje de error específico del servicio
    res.redirect(`/usuarios?mensaje=${encodeURIComponent(error.message)}`);
  }
};

// Reactivar usuario
const reactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = await userService.reactivarUsuario(id);
    if (!usuarioActualizado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado");
    }
    res.redirect("/usuarios?mensaje=Usuario reactivado exitosamente");
  } catch (error) {
    res.redirect(`/usuarios?mensaje=Error al reactivar: ${encodeURIComponent(error.message)}`);
  }
};

// Eliminar usuario
const deleteUsuarios = async (req, res) => {
  try {
    const idAEliminar = req.params.id;
    const idDeQuienElimina = req.user.userId; // Obtenido del token

    const fueEliminado = await userService.eliminarUsuarioConPermisos(
      idAEliminar,
      idDeQuienElimina
    );

    if (!fueEliminado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado para eliminar");
    }
    res.redirect("/usuarios?mensaje=Usuario eliminado exitosamente");
  } catch (error) {
    // Redirigir con el mensaje de error específico del servicio
    res.redirect(`/usuarios?mensaje=${encodeURIComponent(error.message)}`);
  }
};

// --- MÉTODOS DE AUTENTICACIÓN (SIN CAMBIOS) ---

const loginForm = (req, res) => {
  res.render("loginForm");
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authResult = await authService.authenticateUser(email, password);
    res.cookie("token", authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    const isAjax = req.headers["x-requested-with"] === "XMLHttpRequest";
    if (isAjax) {
      return res.json({ success: true, message: "Login exitoso", user: authResult.user });
    }
    res.redirect("/dashboard?login=success");
  } catch (error) {
    const isAjax = req.headers["x-requested-with"] === "XMLHttpRequest";
    if (isAjax) {
      return res.status(401).json({ success: false, message: error.message });
    }
    res.render("loginForm", { mensaje: { texto: error.message, error: true } });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};

const getDashboard = (req, res) => {
  res.render("dashboard", {
    user: req.user,
    loginSuccess: req.query.login === "success",
  });
};

module.exports = {
  getUsuarios,
  postUsuarios,
  createUserForm,
  updateUserForm,
  updateUsuarios,
  desactivarUsuario,
  reactivarUsuario,
  deleteUsuarios,
  loginForm,
  loginUser,
  logoutUser,
  getDashboard,
};