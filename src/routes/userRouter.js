const express = require("express");
const userController = require("../controllers/userController.js");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

// Vista única de usuarios
router.get("/", authMiddleware, userController.getUsuarios);

// Creación de usuarios
router.get("/crear", userController.createUserForm);
router.post("/crear", userController.postUsuarios);

// Actualización de usuarios
router.get("/actualizar/:id", authMiddleware, userController.updateUserForm);
router.post("/actualizar/:id", authMiddleware, userController.updateUsuarios);

// Gestión de estado
router.post(
  "/desactivar/:id",
  authMiddleware,
  userController.desactivarUsuario
);
router.post("/reactivar/:id", authMiddleware, userController.reactivarUsuario);

// Eliminación
router.post("/eliminar/:id", authMiddleware, userController.deleteUsuarios);

module.exports = router;
