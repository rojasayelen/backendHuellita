const Persona = require("./personaModel");

class User extends Persona {
  constructor(nombre, apellido, email, password) {
    super(nombre, apellido, email);
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
