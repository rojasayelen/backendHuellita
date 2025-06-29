const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rutas de autenticación
router.get("/login", userController.loginForm);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

module.exports = router;
