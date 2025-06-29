const userService = require("../services/userServices");
const authService = require("../services/authService");

// Vista única de usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.getAll();

    res.render("usuarios", {
      usuarios,
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
      return res
        .status(400)
        .render("error", { error: "Todos los campos son requeridos." });
    }
    const nuevoUsuario = await userService.create(req.body);
    res.redirect("/usuarios?mensaje=Usuario creado exitosamente");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { error: error.message });
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
    const usuarioActualizado = await userService.actualizarUsuarioPorId(
      id,
      req.body
    );

    if (!usuarioActualizado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado");
    }

    res.redirect("/usuarios?mensaje=Usuario actualizado exitosamente");
  } catch (error) {
    res.redirect("/usuarios?mensaje=Error al actualizar el usuario");
  }
};

// Desactivar usuario
const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = await userService.desactivarUsuario(id);

    if (!usuarioActualizado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado");
    }

    res.redirect("/usuarios?mensaje=Usuario desactivado exitosamente");
  } catch (error) {
    res.redirect("/usuarios?mensaje=Error al desactivar el usuario");
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
    res.redirect("/usuarios?mensaje=Error al reactivar el usuario");
  }
};

// Eliminar usuario
const deleteUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const fueEliminado = await userService.eliminarUsuarioFisicamente(id);

    if (!fueEliminado) {
      return res.redirect("/usuarios?mensaje=Usuario no encontrado");
    }

    res.redirect("/usuarios?mensaje=Usuario eliminado exitosamente");
  } catch (error) {
    res.redirect("/usuarios?mensaje=Error al eliminar el usuario");
  }
};

// Formulario de login
const loginForm = (req, res) => {
  res.render("loginForm");
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Autenticar usuario usando el servicio de autenticación
    const authResult = await authService.authenticateUser(email, password);

    // Establecer cookie con el token
    res.cookie("token", authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: "strict",
    });

    // Verificar si es una petición AJAX
    const isAjax =
      req.headers["content-type"] === "application/json" ||
      req.headers["x-requested-with"] === "XMLHttpRequest";

    if (isAjax) {
      // Responder con JSON para peticiones AJAX
      return res.json({
        success: true,
        message: "Login exitoso",
        user: authResult.user,
        token: authResult.token,
      });
    } else {
      // Redirigir al dashboard para peticiones de formulario
      res.redirect("/dashboard?login=success");
    }
  } catch (error) {
    // Verificar si es una petición AJAX
    const isAjax =
      req.headers["content-type"] === "application/json" ||
      req.headers["x-requested-with"] === "XMLHttpRequest";

    if (isAjax) {
      // Responder con JSON para peticiones AJAX
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    } else {
      // Renderizar formulario de login con mensaje de error
      res.render("loginForm", {
        mensaje: {
          texto: error.message,
          error: true,
        },
      });
    }
  }
};

const logoutUser = (req, res) => {
  // Limpiar la cookie del token
  res.clearCookie("token");
  res.redirect("/auth/login");
};

const getDashboard = async (req, res) => {
  // El middleware de autenticación ya verificó el token
  // y agregó la información del usuario a req.user
  res.render("dashboard", {
    user: req.user,
    loginSuccess: req.query.login === "success",
  });
  const { email, password } = req.body;
  try {
    const user = await userService.verificarCredenciales(email, password);
    if (user) {
      // Guardar sesión
      req.session.user = user;
      return res.redirect("/usuarios");
    }
    return res.render("loginForm", { mensaje: "Credenciales incorrectas" });
  } catch (error) {
    return res.render("loginForm", { mensaje: "Error interno del servidor" });
  }
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
