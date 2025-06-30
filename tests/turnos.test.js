// Mocks antes de importar app y Turno
jest.mock("../src/models/turnoModel", () => {
	return function () {
		return {
			save: jest.fn().mockResolvedValue({}),
		};
	};
});

jest.mock("../src/middleware/authMiddleware");

const Turno = require("../src/models/turnoModel");
const app = require("../index");
const request = require("supertest");

// Métodos estáticos mockeados
Turno.find = jest
	.fn()
	.mockResolvedValue([{ apellido: "González", mascota: "Firulais" }]);

Turno.findById = jest.fn().mockReturnValue({
	lean: jest
		.fn()
		.mockResolvedValue({ apellido: "González", mascota: "Firulais" }),
});

Turno.findByIdAndDelete = jest.fn().mockResolvedValue({});

// describe("API Turnos con mocks", () => {
//  	it("GET /turnos devuelve listado y status 200", async () => {
//  		const res = await request(app).get("/turnos");
//  		expect(res.statusCode).toBe(200);
//  		expect(res.text).toMatch(/González/);
//  	});
// });

	it("GET /turnos/1 devuelve detalle turno y status 200", async () => {
		const res = await request(app).get("/turnos/1");
		expect(res.statusCode).toBe(200);
		expect(res.text).toMatch(/Firulais/);
	});

	it("POST /turnos crea un nuevo turno y redirige", async () => {
		const nuevoTurno = {
			apellido: "Pérez",
			nombre: "Carlos",
			dni: "87654321",
			mascota: "Michi",
			especie: "Gato",
			raza: "Persa",
			fecha: "2025-08-01",
			hora: "15:00",
			tipoConsulta: "Consulta general",
			profesional: "Dr. Ramos",
		};

		const res = await request(app)
			.post("/turnos")
			.type("form")
			.send(nuevoTurno);

		expect(res.statusCode).toBe(302);
	});

	it("DELETE /turnos/1 elimina turno y redirige", async () => {
		const res = await request(app).delete("/turnos/1");
		expect(res.statusCode).toBe(302);
	});

