import Persona from "./personaModel";

class User extends Persona {
  constructor(nombre, apellido, domicilio, telefono, email, username, password) {
    super(nombre, apellido, domicilio, telefono, email);
    this.username = username;
    this.password = password;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    this.password = password;
  }
}