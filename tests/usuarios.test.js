const request = require('supertest');
const app = require('../index.js'); // Importamos tu app de Express desde el archivo principal
const mongoose = require('mongoose');
const User = require('../src/models/userModel.js'); // Ajusta la ruta a tus modelos
const Persona = require('../src/models/personaModel.js');

// --- Configuración de la Base de Datos de Prueba ---
beforeAll(async () => {
    // Usamos una base de datos en memoria o una de prueba.
    // Asegúrate de que tu .env tenga una variable MONGO_URI_TEST
    // o cambia la URL aquí directamente.
    const url = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1/TestHuellitasDB';
    await mongoose.connect(url);
});

// Limpiar las colecciones antes de cada prueba para asegurar un estado limpio.
beforeEach(async () => {
    await Persona.deleteMany();
    await User.deleteMany();
});

// Desconectar después de que todas las pruebas terminen.
afterAll(async () => {
    await mongoose.connection.close();
});


// --- Suite de Pruebas para las Rutas de Usuarios ---

describe('Rutas de Usuarios', () => {

    // 1. PRUEBA DE CREACIÓN (POST /usuarios/crear)
    it('debería crear un nuevo usuario y redirigir a /usuarios', async () => {
        const nuevoUsuario = {
            nombre: 'Juan',
            apellido: 'Test',
            email: 'juan.test@example.com',
            password: 'passwordValido123'
        };

        const response = await request(app)
            .post('/usuarios/crear')
            .send(nuevoUsuario);

        // Verificamos que la respuesta sea una redirección (código 302)
        expect(response.statusCode).toBe(302);
        // Verificamos que nos redirija a la página de usuarios con el mensaje de éxito
        expect(response.headers.location).toBe('/usuarios?mensaje=Usuario creado exitosamente');

        // Opcional: Verificamos que el usuario realmente se creó en la BD
        const personaCreada = await Persona.findOne({ email: 'juan.test@example.com' });
        expect(personaCreada).not.toBeNull();
    });

    // 2. PRUEBA DE CONSULTA (GET /usuarios)
    it('debería obtener una lista de usuarios y renderizar la vista', async () => {
        // Primero, creamos un usuario para asegurarnos de que la base de datos no esté vacía.
        const persona = await Persona.create({ nombre: 'Ana', apellido: 'Prueba', email: 'ana.prueba@test.com' });
        await User.create({ password: 'passwordSeguro456', datosPersonales: persona._id });

        const response = await request(app)
            .get('/usuarios');

        // Verificamos que la respuesta sea exitosa (código 200)
        expect(response.statusCode).toBe(200);
        // Verificamos que la respuesta sea HTML (porque renderiza una vista Pug)
        expect(response.headers['content-type']).toMatch(/html/);
        // Verificamos que el HTML contenga el nombre de nuestro usuario de prueba
        expect(response.text).toContain('Ana Prueba');
    });

});
