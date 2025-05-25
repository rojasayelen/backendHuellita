const fs = require("fs").promises;
const path = require("path");
const fileURLToPath = require('url').fileURLToPath;
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
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("Error crítico al leer el archivo de usuarios:", error);
        throw new Error('Error al acceder a la base de datos de usuarios.');
    }
}


const getUsuarios = async (req, res) => {
    try {
        const rutaJSON = path.join(__dirname, "..", "data", "usuarios.json");
        const data = await fs.readFile(rutaJSON, "utf-8");
        const usuarios = JSON.parse(data);  
        res.render("usuarios", { usuarios });
    }catch (error) {
        console.error("Error al leer el archivo JSON:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

const postUsuarios = async (req, res) => {
    try {
        // 1. Obtener los datos del body
        
        const { nombre, apellido, email, password } = req.body;

        // 2. Validación de campos requeridos
        if (!nombre || !apellido || !email || !password ) {
            return res.status(400).json({
                error: "Todos los campos son requeridos: nombre, apellido, mail, password."
            });
        }

        // 3. Leer usuarios existentes del archivo JSON
       const usuarios = await leerUsuariosDesdeArchivo();
        

        // 4. Verificar si el email ya existe
        if (usuarios.some(user => user.email === email)) {
            return res.status(400).json({ error: `El email '${email}' ya está registrado.` });
        }

        // 5. Generar un nuevo ID para el usuario
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id))  + 1 : 1;

        const usuario = new User(nombre, apellido, email, password);

        console.log('req.body', req.body);
        console.log('usuario', usuario);
        // 6. Crear el nuevo objeto de usuario
        const guardarUsuario = {
           
            id: nuevoId,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: usuario.password
        };

        // 7. Agregar el nuevo usuario al array
        usuarios.push(guardarUsuario);

        // 8. Escribir el array actualizado de vuelta al archivo JSON
        await fs.writeFile(rutaJSON, JSON.stringify(usuarios, null, 2), "utf-8");

        // 9. respuesta de éxito 
        console.log('este es el body', req.body);
        
        const { password: _, ...usuarioCreadoSinPassword } = guardarUsuario; 
        console.log()
        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: usuarioCreadoSinPassword
        });

    } catch (error) {
       
        console.error("Error en la función postUsuarios:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar la solicitud." });
    }
}

module.exports = {
    getUsuarios,
    postUsuarios
};

