const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Error interno del servidor';
	
	// Si es un error de validación
	if (err.name === 'ValidationError') {
	  return res.status(400).json({
		error: 'Error de validación',
		details: Object.values(err.errors).map(e => e.message)
	  });
	}
	
	// Si es un error de duplicado
	if (err.code === 11000) {
	  const field = Object.keys(err.keyValue)[0];
	  return res.status(400).json({
		error: `${field} ya está registrado`
	  });
	}
	
	// Renderizar vista de error para rutas HTML
	if (req.accepts('html')) {
	  return res.status(statusCode).render('error', { 
		error: message,
		statusCode
	  });
	}
	
	// Enviar JSON para API
	res.status(statusCode).json({ error: message });
  };
  
  module.exports = errorHandler;