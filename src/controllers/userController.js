const fs = require("fs").promises;
const path = require("path");
const fileURLToPath = require("url").fileURLToPath;

// // Ruta del archivo JSON
const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");

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
    console.log(req);
    const { nombre, apellido, mail, password } = req.body;

    // 2. Validación de campos requeridos
    if (!nombre || !apellido || !mail || !password) {
      return res.status(400).json({
        error:
          "Todos los campos son requeridos: nombre, apellido, mail, password.",
      });
    }

    // 3. Leer usuarios existentes del archivo JSON
    let usuarios = [];
    try {
      const data = await fs.readFile(rutaJSON, "utf-8");
      if (data) {
        usuarios = JSON.parse(data);
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(
          "Error al leer el archivo JSON (pero no es ENOENT):",
          error
        );
        return res
          .status(500)
          .json({ error: "Error al leer la base de datos de usuarios." });
      }
    }

    // 4. Verificar si el email ya existe
    if (usuarios.some((user) => user.mail === mail)) {
      return res
        .status(400)
        .json({ error: `El email '${mail}' ya está registrado.` });
    }

    // 5. Generar un nuevo ID para el usuario
    const nuevoId =
      usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

    // 6. Crear el nuevo objeto de usuario
    const nuevoUsuario = {
      id: nuevoId,
      nombre,
      apellido,
      mail,
      password: password,
      //TO DO: agregar tipo de usuario
      // tipo_usuario
    };

    // 7. Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // 8. Escribir el array actualizado de vuelta al archivo JSON
    await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");

    // 9. respuesta de éxito
    const { password: _, ...usuarioCreadoSinPassword } = nuevoUsuario;
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

const loginForm = async (__, res) => {
  res.render("loginForm");
};

const loginUser = async (req, res) => {
  const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");
  const data = await fs.readFile(rutaJSON, "utf-8");
  const usuarios = JSON.parse(data);

  const { mail, password } = req.body;

  const user = usuarios.find((u) => u.mail === mail && u.password === password);

  if (user) {
    return res.render("loginRespuesta", { mensaje: "Login exitoso" });
  } else {
    return res.render("loginRespuesta", {
      mensaje: "Credenciales incorrectas",
    });
  }
};

module.exports = {
  getUsuarios,
  postUsuarios,
  loginForm,
  loginUser,
};
