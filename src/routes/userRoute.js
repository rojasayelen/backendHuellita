const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  postUsuarios,
  updateUserForm,
  updateUsuarios,
  loginUser,
  loginForm,
} = require("../controllers/userController");

router.get("/", getUsuarios);
router.post("/", postUsuarios);

router.get("/update", updateUserForm);
router.put("/update", updateUsuarios);

router.get("/login", loginForm);
router.post("/login", loginUser);

module.exports = router;
