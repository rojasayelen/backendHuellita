const express = require("express");
const userController = require("../controllers/userController.js");
const router = express.Router();

// Rutas para vistas de administración y lista pública
router.get("/admin", userController.getAdminUsuarios);
router.get("/", userController.getUsuarios);

// Ruta para creación de usuarios (API)
router.post("/", userController.postUsuarios);

router.get("/crear", userController.createUserForm);
router.post("/crear", userController.postUsuarios);

//TO DO: Revisar rutas por funcionalidad    

// // Rutas para el formulario de actualización
// router.get("/update", userController.updateUserForm);
// router.post("/update", userController.updateUsuarios);

// // Ruta para eliminar un usuario (espera un ID en la URL)
// router.post("/delete/:id", userController.deleteUsuarios); // Usamos POST para que funcione desde un formulario simple

// // Rutas para el formulario de login
// router.get("/login", userController.loginForm);
// router.post("/login", userController.loginUser);

module.exports = router;
