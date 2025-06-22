const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
//const authMiddleware = require('../middleware/authMiddleware'); // Descomentar si se requiere autenticación
const { validarProducto, validarMovimiento } = require('../middleware/validators/stockValidator');

// Redirigir /stock 
router.get('/', stockController.obtenerAlertas); 

router.get('/productos', stockController.listarProductos);
// Mostrar formulario de creación
router.get('/productos/nuevo', stockController.mostrarFormularioNuevo);

// Procesar creación de producto
router.post('/productos', validarProducto, stockController.crearProducto);

// Rutas de Movimientos
router.post('/movimientos', validarMovimiento, stockController.registrarMovimiento);

// Rutas de Alertas
router.get('/dashboard', stockController.obtenerAlertas);

// Rutas de Reportes
router.get('/reportes', stockController.generarReporte);


module.exports = router;