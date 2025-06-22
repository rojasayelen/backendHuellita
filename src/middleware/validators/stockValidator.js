const { body, validationResult } = require('express-validator');

// Función para manejar errores de validación (reutilizable)
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return res.redirect(req.originalUrl);
  }
  next();
};

exports.validarProducto = [
  body('codigo')
    .notEmpty().withMessage('El código es requerido')
    .isAlphanumeric().withMessage('El código debe ser alfanumérico'),
  
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
  
  body('categoria')
    .isIn(['medicamento', 'alimento', 'accesorio', 'higiene'])
    .withMessage('Categoría inválida'),
  
  body('stockMinimo')
    .isInt({ min: 0 }).withMessage('Debe ser un número entero positivo'),
  
  body('precio')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Debe ser un número positivo'),
  
  handleValidationErrors
];

exports.validarMovimiento = [
  body('tipo').isIn(['entrada', 'salida', 'ajuste'])
    .withMessage('Tipo de movimiento inválido'),
  body('producto').notEmpty().withMessage('Producto es requerido'),
  body('cantidad').isFloat({ gt: 0 }).withMessage('Cantidad debe ser mayor a 0'),
  handleValidationErrors
];

exports.crearProducto = [
  body('codigo').notEmpty().withMessage('El código es requerido'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('categoria').isIn(['medicamento', 'alimento', 'accesorio', 'higiene'])
    .withMessage('Categoría inválida'),
  handleValidationErrors
];

exports.validarProducto = [
  body('codigo')
    .notEmpty().withMessage('El código es requerido')
    .isAlphanumeric().withMessage('El código debe ser alfanumérico'),
  
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
  
  body('categoria')
    .isIn(['medicamento', 'alimento', 'accesorio', 'higiene'])
    .withMessage('Categoría inválida'),
  
  body('stockMinimo')
    .isInt({ min: 0 }).withMessage('Debe ser un número entero positivo'),
  
  body('precio')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Debe ser un número positivo'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(e => e.msg));
      return res.redirect(req.originalUrl);
    }
    next();
  }
];