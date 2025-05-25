
const Persona = require("./personaModel");

class User extends Persona {
  constructor(nombre, apellido, domicilio, telefono, email, password) {
    super(nombre, apellido, domicilio, telefono, email);
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    this.password = password;
  }
}

module.exports = User;