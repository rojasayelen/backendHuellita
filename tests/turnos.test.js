const request = require("supertest");
const app = require("../index");

// =============================================================================
// Mock #1: Mongoose (para evitar la conexión real a la DB y el timeout)
// =============================================================================
jest.mock("mongoose", () => {
	const originalMongoose = jest.requireActual("mongoose");
	return {
		...originalMongoose,
		connect: jest.fn().mockResolvedValue(),
		disconnect: jest.fn().mockResolvedValue(),
	};
});

// =============================================================================
// Mock #2: El Modelo 'Turno' (usando tu código de mock manual)
// =============================================================================
jest.mock("../src/models/turnoModel.js", () => {
	const turnosMock = [
		{
			_id: "1",
			apellido: "Gonzalez",
			nombre: "Ana",
			dni: "12345678",
			mascota: "Firulais",
			especie: "Perro",
			raza: "Labrador",
			fecha: "2025-07-10",
			hora: "10:00",
			tipoConsulta: "Vacunación",
			profesional: "Dra. López",
			estado: "pendiente",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	function Turno(data) {
		const newTurno = { _id: new Date().getTime().toString(), ...data };
		Object.assign(this, newTurno);
	}

	Turno.prototype.save = jest.fn(function () {
		turnosMock.push(this);
		return Promise.resolve(this);
	});

	Turno.find = jest.fn(() => ({
		lean: jest.fn().mockResolvedValue(turnosMock),
	}));

	Turno.findById = jest.fn((id) => {
		const turno = turnosMock.find((t) => t._id === id);
		return { lean: jest.fn().mockResolvedValue(turno || null) };
	});

	Turno.findByIdAndUpdate = jest.fn((id, update) => {
		const turno = turnosMock.find((t) => t._id === id);
		if (turno) {
			Object.assign(turno, update);
			return Promise.resolve(turno);
		}
		return Promise.resolve(null);
	});

	Turno.findByIdAndDelete = jest.fn((id) => {
		const index = turnosMock.findIndex((t) => t._id === id);
		if (index !== -1) {
			turnosMock.splice(index, 1);
			return Promise.resolve(true);
		}
		return Promise.resolve(null);
	});

	return Turno;
});

// =============================================================================
// Mock #3: Middleware de Autenticación
// =============================================================================
jest.mock("../src/middleware/authMiddleware", () => ({
	authMiddleware: (req, res, next) => {
		req.user = { id: "mockUserId", name: "Mock User" };
		next();
	},
}));

// Importamos el modelo DESPUÉS de haberlo mockeado
const Turno = require("../src/models/turnoModel.js");

// =============================================================================
// Suite de Tests
// =============================================================================
describe("Turnos Router Tests con Modelo Mockeado", () => {
	// Limpiamos las llamadas a los mocks después de cada test
	afterEach(() => {
		jest.clearAllMocks();
	});

	// --- Test para GET /turnos ---
	describe("GET /turnos", () => {
		it("debería llamar al método find del modelo y devolver status 200", async () => {
			// Act
			const response = await request(app).get("/turnos");

			// Assert
			expect(response.statusCode).toBe(200);
			expect(Turno.find).toHaveBeenCalledTimes(1); // Verificamos que el controlador usó el modelo
		});
	});

	// --- Test para POST /turnos ---
	describe("POST /turnos", () => {
		it("debería usar el mock para crear un nuevo turno y redirigir", async () => {
			// Arrange
			const nuevoTurnoData = {
				apellido: "Rojas",
				nombre: "Lorena",
				dni: "12345678",
				mascota: "Michi",
				especie: "Felino",
				raza: "Siames",
				fecha: "2025-07-10",
				hora: "17:30",
				tipoConsulta: "Control General",
				profesional: "Dra. Quinn",
			};

			// Act
			const response = await request(app).post("/turnos").send(nuevoTurnoData);

			// Assert
			expect(response.statusCode).toBe(302); // Verificamos la redirección
			expect(Turno.prototype.save).toHaveBeenCalledTimes(1); // Verificamos que se intentó guardar
		});
	});
});
