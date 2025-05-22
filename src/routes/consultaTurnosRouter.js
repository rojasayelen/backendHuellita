const express = require('express');
const router = express.Router();
const { obtenerTurnosFiltrados } = require('../controllers/consultaTurnosController');

router.get('/', obtenerTurnosFiltrados);

module.exports = router;
