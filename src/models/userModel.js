const Persona = require("./personaModel");

class User extends Persona {
  #password;

  constructor(nombre, apellido, email, password) {
    super(nombre, apellido, email);
    this.setPassword(password);
  }

//Getters
  getPassword() {
    return this.#password;
  }

//Setters
   setPassword(nuevaPassword){
    const clave = 8;
    if (typeof nuevaPassword === 'string' && nuevaPassword.length >= clave) {
      this.#password = nuevaPassword;
    } else {
      throw new Error(`La contraseña debe tener al menos ${clave} caracteres.`);
    }
    this.password = nuevaPassword.trim();
   }
}

module.exports = User;
