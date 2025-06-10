const express = require("express");
const router = express.Router(); // <--- Aquí creas el enrutador
const {
  getUsuarios,
  postUsuarios,
  updateUserForm,
  updateUsuarios,
  deleteUsuarios,
  getAdminUsuarios,
  loginUser,
  loginForm,
} = require("../controllers/userController");

router.get("/", getUsuarios); // GET /usuarios
router.get("/admin", getAdminUsuarios); // GET /usuarios/admin
router.post("/", postUsuarios); // POST /usuarios (para crear usuario)
router.delete("/deleteUsuario/:id", deleteUsuarios); // DELETE /usuarios/deleteUsuario/:id

router.get("/update", updateUserForm);
router.put("/update", updateUsuarios);

router.get("/login", loginForm);
router.post("/login", loginUser);


module.exports = router; // <-- Exportas el enrutador completo
