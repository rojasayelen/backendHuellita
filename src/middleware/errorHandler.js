const errorHandler = (err, req, res, next) => {
	console.error("Error:", err);

	res.status(err.status || 500).json({
		error: true,
		mensaje: err.message || "Error interno del servidor",
	});
};

module.exports = errorHandler;
