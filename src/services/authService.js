const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userService = require("./userServices");

class AuthService {
  // Generar token JWT
  generateToken(user) {
    // Asegurarse de extraer nombre y apellido correctamente
    const nombre = user.nombre || user.datosPersonales?.nombre;
    const apellido = user.apellido || user.datosPersonales?.apellido;
    const payload = {
      userId: user._id || user.id,
      email: user.email || user.datosPersonales?.email,
      nombre,
      apellido,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token válido por 24 horas
    });
  }

  // Verificar token JWT
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

  // Autenticar usuario
  async authenticateUser(email, password) {
    try {
      // Buscar usuario por email
      const user = await userService.getByEmail(email);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Contraseña incorrecta");
      }

      // Generar token con nombre y apellido correctos
      const token = this.generateToken(user);

      // Extraer nombre y apellido para el frontend
      const nombre = user.nombre || user.datosPersonales?.nombre;
      const apellido = user.apellido || user.datosPersonales?.apellido;
      const emailFinal = user.email || user.datosPersonales?.email;
      const idFinal = user._id || user.id;

      return {
        user: {
          id: idFinal,
          nombre,
          apellido,
          email: emailFinal,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(token) {
    try {
      if (!token) {
        return false;
      }

      const decoded = this.verifyToken(token);
      const user = await userService.getById(decoded.userId);

      return user ? true : false;
    } catch (error) {
      return false;
    }
  }

  // Obtener información del usuario desde el token
  async getUserFromToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await userService.getById(decoded.userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
