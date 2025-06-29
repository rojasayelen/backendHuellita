const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token de las cookies
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      // Si no hay token, redirigir al login
      return res.redirect("/auth/login");
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar la información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      nombre: decoded.nombre,
      apellido: decoded.apellido,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // Token inválido, limpiar cookie y redirigir
      res.clearCookie("token");
      return res.redirect("/auth/login");
    }
    if (error.name === "TokenExpiredError") {
      // Token expirado, limpiar cookie y redirigir
      res.clearCookie("token");
      return res.redirect("/auth/login");
    }
    // Otro error, redirigir al login
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }
};

module.exports = { authMiddleware };
