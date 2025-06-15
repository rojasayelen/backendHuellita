const Persona = require("../models/personaModel");
const User = require("../models/userModel");

console.log('--- Depurando userService.js ---');
console.log('Tipo de Persona importado:', typeof Persona);
console.log('Contenido de Persona:', Persona);
console.log('--- Fin de la Depuración ---');

const create = async (userData) => {
  const { nombre, apellido, email, password, rol } = userData;

    try {
      const instanciaPersona = new Persona({ nombre, apellido, email });
      await instanciaPersona.save();

      const nuevoUsuario = await User.create({
        password: password,
        datosPersonales: instanciaPersona._id,
        rol: rol
      });
      return nuevoUsuario;
    }catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
          const customError = new Error(`El email '${email}' ya está registrado.`);
          customError.statusCode = 400; // Bad Request
          throw customError;
        }
      throw error;
    }
  };

const getAll = async () => {
  const usuarios = await User.find().populate("datosPersonales");
  return usuarios;
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
  // postUsuarios,
  // getAdminUsuarios,
  // updateUserForm,
  // updateUsuarios,
  // deleteUsuarios,
  // loginForm,
  // loginUser,
};

