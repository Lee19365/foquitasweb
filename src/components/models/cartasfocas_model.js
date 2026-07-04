// models/Foca.js
export class Foca {
  constructor({id, titulo, imagen, descripcion}) {
    this.id = id;
    this.titulo = titulo;
    this.imagen = imagen;
    this.descripcion = descripcion;
  }

  // convertir a JSON (opcional)
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      imagen: this.imagen,
      descripcion: this.descripcion
    };
  }

  // crear una instancia desde JSON
  static fromJSON(data) {
    return new Foca(data);
  }
}
