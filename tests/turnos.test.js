const request = require("supertest");
const app = require("../index");
const userService = require("../src/services/userServices");

// 1. Mockear el service y el middleware
jest.mock("../src/services/userServices");
jest.mock("../src/middleware/authMiddleware", () => ({
	authMiddleware: (req, res, next) => {
		req.user = { id: "mockUserId", name: "Mock User" };
		next();
	},
}));

describe("User Router Tests", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	// --- Pruebas para la Creación de Usuarios ---
	describe("POST /usuarios/crear", () => {
		it("debería crear un usuario exitosamente y redirigir", async () => {
			const mockUserData = {
				nombre: "Juan",
				apellido: "Perez",
				email: "juan@test.com",
				password: "123",
			};
			userService.create.mockResolvedValue(mockUserData);

			const response = await request(app)
				.post("/usuarios/crear")
				.send(mockUserData);

			expect(userService.create).toHaveBeenCalledWith(mockUserData);
			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20creado%20exitosamente"
			);
		});
	});

	// --- Pruebas para Obtener todos los Usuarios---
	describe("GET /usuarios", () => {
		it("debería obtener todos los usuarios y devolver status 200", async () => {
			// Arrange
			const mockUsers = [
				{
					datosPersonales: {
						nombre: "Usuario",
						apellido: "Uno",
						email: "uno@test.com",
					},
					roles: ["user"],
					activo: true,
				},
			];
			userService.getAll.mockResolvedValue(mockUsers);

			// Act
			const response = await request(app).get("/usuarios");

			// Assert
			expect(response.statusCode).toBe(200);
			expect(userService.getAll).toHaveBeenCalledTimes(1);
		});
	});

	// --- Pruebas para Eliminar un Usuario ---
	describe("POST /usuarios/eliminar/:id", () => {
		it("debería eliminar un usuario y redirigir", async () => {
			const userId = "un-id-valido";
			userService.eliminarUsuarioFisicamente.mockResolvedValue(true);

			const response = await request(app).post(`/usuarios/eliminar/${userId}`);

			expect(userService.eliminarUsuarioFisicamente).toHaveBeenCalledWith(
				userId
			);
			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20eliminado%20exitosamente"
			);
		});
	});

	// --- Pruebas para Reactivar un Usuario ---
	describe("POST /usuarios/reactivar/:id", () => {
		it("debería reactivar un usuario y redirigir", async () => {
			const userId = "un-id-valido";
			userService.reactivarUsuario.mockResolvedValue(true);

			const response = await request(app).post(`/usuarios/reactivar/${userId}`);

			expect(userService.reactivarUsuario).toHaveBeenCalledWith(userId);
			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20reactivado%20exitosamente"
			);
		});
	});
});
