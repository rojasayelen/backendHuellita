// src/middleware/__mocks__/authMiddleware.js

const authMiddleware = (req, res, next) => {
	req.user = {
		userId: "mockUserId",
		email: "test@example.com",
		nombre: "Test",
		apellido: "User",
		role: "mockRole",
	};
	next();
};

module.exports = { authMiddleware };

