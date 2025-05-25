const fs = require("fs").promises;
const path = require("path");
const fileURLToPath = require("url").fileURLToPath;
const User = require("../models/userModel");

// // Ruta del archivo JSON
const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");

async function leerUsuariosDesdeArchivo() {
  try {
    const data = await fs.readFile(rutaJSON, "utf-8");
    if (data) {
      return JSON.parse(data);
    }

    return [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    console.error("Error crítico al leer el archivo de usuarios:", error);
    throw new Error("Error al acceder a la base de datos de usuarios.");
  }
}

const getUsuarios = async (req, res) => {
  try {
    const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");
    const data = await fs.readFile(rutaJSON, "utf-8");
    const usuarios = JSON.parse(data);
    res.render("usuarios", { usuarios });
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const postUsuarios = async (req, res) => {
  try {
    // 1. Obtener los datos del body

    const { nombre, apellido, email, password } = req.body;

    // 2. Validación de campos requeridos
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        error:
          "Todos los campos son requeridos: nombre, apellido, mail, password.",
      });
    }

    // 3. Leer usuarios existentes del archivo JSON
    const usuarios = await leerUsuariosDesdeArchivo();

    // 4. Verificar si el email ya existe
    if (usuarios.some((user) => user.email === email)) {
      return res
        .status(400)
        .json({ error: `El email '${email}' ya está registrado.` });
    }

    // 5. Generar un nuevo ID para el usuario
    const nuevoId =
      usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

    const usuario = new User(nombre, apellido, email, password);

    // 6. Crear el nuevo objeto de usuario
    const guardarUsuario = {
      id: nuevoId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
    };

    // 7. Agregar el nuevo usuario al array
    usuarios.push(guardarUsuario);

    // 8. Escribir el array actualizado de vuelta al archivo JSON
    await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");

    // 9. respuesta de éxito

    const { password: _, ...usuarioCreadoSinPassword } = guardarUsuario;

    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: usuarioCreadoSinPassword,
    });
  } catch (error) {
    console.error("Error en la función postUsuarios:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al procesar la solicitud." });
  }
};

const updateUserForm = async (__, res) => {
  res.render("updateUserForm");
};

const updateUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, domicilio, telefono, email } = req.body;

    if (!nombre || !apellido || !domicilio || !telefono) {
      return res.render("updateUserResponse", {
        mensaje:
          "Todos los campos son queredidos: nombre, apellido, domicilio, telefono.",
      });
      s;
    }

    const usuarios = await leerUsuariosDesdeArchivo();

    currentUser = usuarios.find((user) => user.email === email);

    if (!currentUser) {
      return res.render("updateUserResponse", {
        mensaje: "Usuario inexistente",
      });
    }

    currentUser.nombre = nombre;
    currentUser.apellido = apellido;
    currentUser.domicilio = domicilio;
    currentUser.telefono = telefono;

    const newUsuarios = usuarios.filter((user) => user.id !== currentUser.id);

    newUsuarios.push(currentUser);

    await fs.writeFile(rutaJSON, JSON.stringify(newUsuarios, null, 2), "utf-8");

    const { password: _, ...usuarioCreadoSinPassword } = currentUser;

    return res.render("updateUserResponse", {
      usuario: usuarioCreadoSinPassword,
    });
  } catch (error) {
    return res.render("updateUserResponse", {
      mensaje: "Error en interno del servidor",
    });
  }
};

const getAdminUsuarios = async (req, res) => {
  try {
    const usuarios = await leerUsuariosDesdeArchivo();
    res.render("adminUser", { usuarios }); // Renderiza vista adminUser.pug
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar la vista de administración" });
  }
};

const deleteUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = await leerUsuariosDesdeArchivo();

    const indiceUsuario = usuarios.findIndex(
      (user) => user.id === parseInt(id)
    );

    if (indiceUsuario === -1) {
      return res
        .status(404)
        .render("error", { error: "Usuario no encontrado" });
    }

    usuarios.splice(indiceUsuario, 1);

    await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");

    res.redirect("/usuarios/admin");
  } catch (error) {
    console.error("Error al eliminar usuario:", error); // Añadir log para depuración
    res.status(500).render("error", {
      error: "Error interno del servidor al eliminar usuario",
    });
  }
};

//#region  login
const loginForm = async (__, res) => {
  res.render("loginForm");
};

const loginUser = async (req, res) => {
  const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");
  const data = await fs.readFile(rutaJSON, "utf-8");
  const usuarios = JSON.parse(data);

  const { email, password } = req.body;

  const user = usuarios.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return res.render("loginForm", { mensaje: "Login exitoso" });
  } else {
    return res.render("loginForm", {
      mensaje: "Credenciales incorrectas",
    });
  }
};
//#endregion

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
