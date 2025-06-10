class Persona {
  #nombre;
  #apellido;
  #email;
    constructor(nombre, apellido, email) {
      this.setNombre(nombre);
      this.setApellido(apellido);
      this.setEmail(email);
    }

  //Getters
  getNombre() {
      return this.#nombre;
  }

  getApellido() {
      return this.#apellido;
  }
  getEmail() {
      return this.#email;
  }

  //Setters
  setNombre(nuevoNombre) {
      if (typeof nuevoNombre === 'string' && nuevoNombre.trim() !== '') {
          this.#nombre = nuevoNombre;
      } else {
          throw new Error('El nombre no puede estar vacio.');
      }
      this.nombre = nuevoNombre.trim();
  }

  setApellido(nuevoApellido) {
      if (typeof nuevoApellido === 'string' && nuevoApellido.trim() !== '') {
          this.#apellido = nuevoApellido;
      } else {
          throw new Error('El apellido no puede estar vacio.');
      }
      this.apellido = nuevoApellido.trim();
  }

  setEmail(nuevoEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(nuevoEmail)) {
          this.#email = nuevoEmail;
      } else {
          throw new Error('El email no es valido.');
      }
      this.email = nuevoEmail.trim();
  }
}

module.exports = Persona;
