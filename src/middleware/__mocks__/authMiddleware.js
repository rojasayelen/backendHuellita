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

// // Mock simple que siempre pasa el middleware sin chequear auth
// // src/middleware/authMiddleware.js
// const authMiddleware = (req, res, next) => {
// 	req.user = {
// 		userId: "mockUserId",
// 		email: "mockuser@example.com",
// 		nombre: "Mock",
// 		apellido: "User",
// 	};
// 	next();
// };

// module.exports = authMiddleware;
