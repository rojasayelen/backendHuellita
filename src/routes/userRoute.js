const express = require("express");
const router = express.Router();
const {
    getUsuarios,
    postUsuarios
} = require("../controllers/userController");

router.get("/", getUsuarios);
router.post("/", postUsuarios);

module.exports = router;