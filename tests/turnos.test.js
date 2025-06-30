// tests/turnos.test.js

const request = require("supertest");
const app = require("../index");
const turnoService = require("../src/services/turnoService"); // Asumo que el servicio existe

// 1. Mockeamos el servicio y el middleware, igual que en usuarios.test.js
jest.mock("../src/services/turnoService");
jest.mock("../src/middleware/authMiddleware", () => ({
	authMiddleware: (req, res, next) => {
		req.user = { id: "mockUserId", name: "Mock User" };
		next();
	},
}));

describe("Turnos Router Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	// --- Prueba para GET /turnos (la que estaba comentada) ---
	describe("GET /turnos", () => {
		it("debería obtener la lista de turnos y devolver status 200", async () => {
			// Arrange
			const mockTurnos = [{ apellido: "González", mascota: "Firulais" }];
			turnoService.getAll.mockResolvedValue(mockTurnos);

			// Act
			const response = await request(app).get("/turnos");

			// Assert
			expect(response.statusCode).toBe(200);
			expect(turnoService.getAll).toHaveBeenCalledTimes(1);
		});
	});

	// --- Prueba para POST /turnos ---
	describe("POST /turnos", () => {
		it("debería crear un nuevo turno y redirigir", async () => {
			// Arrange
			const nuevoTurno = { mascota: "Michi", fecha: "2025-08-01" };
			turnoService.create.mockResolvedValue(nuevoTurno);

			// Act
			const response = await request(app).post("/turnos").send(nuevoTurno);

			// Assert
			expect(turnoService.create).toHaveBeenCalledWith(nuevoTurno);
			expect(response.statusCode).toBe(302);
		});
	});
});
