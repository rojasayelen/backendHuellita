const userService = require("../services/userServices");
const authService = require("../services/authService");

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
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }
    const nuevoUsuario = await userService.create(req.body);
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", usuario: nuevoUsuario });
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
      return res.render("updateUserResponse", {
        mensaje: "Nombre, apellido y email son requeridos.",
      });
    }
    const usuarioActualizado = await userService.updateByEmail(email, {
      nombre,
      apellido,
    });
    if (!usuarioActualizado) {
      return res.render("updateUserResponse", {
        mensaje: "Usuario inexistente.",
      });
    }
    return res.render("updateUserResponse", { usuario: usuarioActualizado });
  } catch (error) {
    return res.render("updateUserResponse", {
      mensaje: "Error interno del servidor.",
    });
  }
};

const getAdminUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.getAll();
    res.render("adminUser", { usuarios });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar la vista de administración." });
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

const getDashboard = (req, res) => {
  // El middleware de autenticación ya verificó el token
  // y agregó la información del usuario a req.user
  res.render("dashboard", {
    user: req.user,
    loginSuccess: req.query.login === "success",
  });
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
  logoutUser,
  getDashboard,
};
