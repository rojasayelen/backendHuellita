const express = require("express");
const router = express.Router(); // <--- Aquí creas el enrutador
const {
  getUsuarios,
  postUsuarios,
  deleteUsuarios,
  getAdminUsuarios,
  loginUser,
  loginForm,
} = require("../controllers/userController");

router.get("/", getUsuarios); // GET /usuarios
router.get("/admin", getAdminUsuarios); // GET /usuarios/admin
router.post("/", postUsuarios); // POST /usuarios (para crear usuario)
router.delete("/deleteUsuario/:id", deleteUsuarios); // DELETE /usuarios/deleteUsuario/:id

router.get("/login", loginForm); // GET /usuarios/login
router.post("/login", loginUser); // POST /usuarios/login

module.exports = router; // <-- Exportas el enrutador completo