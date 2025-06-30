const request = require("supertest");
const userService = require("../src/services/userServices");

const app = require("../index");

// 1. Mockear el service y el middleware
jest.mock("../src/services/userServices");
jest.mock("../src/middleware/authMiddleware", () => ({
	// Mockeamos la propiedad 'authMiddleware' para que simul un usuario autenticado y pasa al siguiente middleware.
	authMiddleware: (req, res, next) => {
		req.user = { id: "mockUserId", name: "Mock User" }; 
		next();
	},
}));

describe("User Router Tests", () => {
	// Limpia los mocks después de cada prueba para evitar que un test afecte a otro.
	afterEach(() => {
		jest.clearAllMocks();
	});

	// --- Pruebas para la Creación de Usuarios ---
	describe("POST /usuarios/crear", () => {
		it("debería crear un usuario exitosamente y redirigir", async () => {
			// Arrange: Preparar el escenario
			const mockUserData = {
				nombre: "Juan",
				apellido: "Perez",
				email: "juan@test.com",
				password: "123",
			};
			userService.create.mockResolvedValue(mockUserData);

			// Act: Ejecutamos la acción
			const response = await request(app)
				.post("/usuarios/crear")
				.send(mockUserData);

			// Assert: Verificar los resultados
			expect(userService.create).toHaveBeenCalledWith(mockUserData);
			expect(response.statusCode).toBe(302);
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20creado%20exitosamente"
			);
		});

		it("debería devolver un error 400 si faltan campos", async () => {
			// Arrange
			const incompleteUserData = { nombre: "Juan" };

			// Act
			const response = await request(app)
				.post("/usuarios/crear")
				.send(incompleteUserData);

			// Assert
			expect(response.statusCode).toBe(400);
			expect(userService.create).not.toHaveBeenCalled();
		});
	});

	// --- Pruebas para Obtener todos los Usuarios ---
	describe("GET /usuarios", () => {
		it("debería obtener todos los usuarios y devolver status 200", async () => {
			
            
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
				{
					datosPersonales: {
						nombre: "Usuario",
						apellido: "Dos",
						email: "dos@test.com",
					},
					roles: ["admin"],
					activo: false,
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
			// Arrange
			const userId = "un-id-valido";
			userService.eliminarUsuarioFisicamente.mockResolvedValue(true);

			// Act
			const response = await request(app).post(`/usuarios/eliminar/${userId}`);

			// Assert
			expect(userService.eliminarUsuarioFisicamente).toHaveBeenCalledWith(
				userId
			);
			expect(response.statusCode).toBe(302);
			// FIX: Usamos la URL codificada
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20eliminado%20exitosamente"
			);
		});

		it("debería redirigir con mensaje de error si el usuario no se encuentra", async () => {
			// Arrange
			const userId = "un-id-invalido";
			userService.eliminarUsuarioFisicamente.mockResolvedValue(false);

			// Act
			const response = await request(app).post(`/usuarios/eliminar/${userId}`);

			// Assert
			expect(userService.eliminarUsuarioFisicamente).toHaveBeenCalledWith(
				userId
			);
			expect(response.statusCode).toBe(302);
			// FIX: Usamos la URL codificada
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20no%20encontrado"
			);
		});
	});

	// --- Pruebas para Reactivar un Usuario ---
	describe("POST /usuarios/reactivar/:id", () => {
		it("debería reactivar un usuario y redirigir", async () => {
			// Arrange
			const userId = "un-id-valido";
			userService.reactivarUsuario.mockResolvedValue(true);

			// Act
			const response = await request(app).post(`/usuarios/reactivar/${userId}`);

			// Assert
			expect(userService.reactivarUsuario).toHaveBeenCalledWith(userId);
			expect(response.statusCode).toBe(302);
			// FIX: Usamos la URL codificada
			expect(response.headers.location).toBe(
				"/usuarios?mensaje=Usuario%20reactivado%20exitosamente"
			);
		});
	});
});
