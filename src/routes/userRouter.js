const express = require("express");
const userController = require("../controllers/userController.js");
const router = express.Router();

// Vista única de usuarios
router.get("/", userController.getUsuarios);

// Creación de usuarios
router.get("/crear", userController.createUserForm);
router.post("/crear", userController.postUsuarios);

// Actualización de usuarios
router.get("/actualizar/:id", userController.updateUserForm);
router.post("/actualizar/:id", userController.updateUsuarios);

// Gestión de estado
router.post("/desactivar/:id", userController.desactivarUsuario);
router.post("/reactivar/:id", userController.reactivarUsuario);

// Eliminación
router.post("/eliminar/:id", userController.deleteUsuarios);

// Formulario de login (sin funcionalidad real)
router.get("/login", userController.loginForm);
router.post("/login", (req, res) => res.redirect("/usuarios")); // Redirige directamente
router.get("/logout", (req, res) => res.redirect("/")); // Redirige a inicio

module.exports = router;