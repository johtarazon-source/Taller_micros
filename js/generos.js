class GestorGeneros {
  constructor() {
    this.token = localStorage.getItem('token');
    this.usuario = localStorage.getItem('usuario');

    this.elementos = {
      infoUsuario: document.getElementById('info-usuario'),
      enlaceLogin: document.getElementById('enlace-login'),
      enlaceRegistro: document.getElementById('enlace-registro'),
      botonLogout: document.getElementById('boton-cerrar-sesion'),
      cuadriculaGeneros: document.getElementById('cuadricula-generos')
    };

    this.generosDisponibles = [
      { nombre: 'Ficción', icon: '📖' },
      { nombre: 'Fantasía', icon: '✨' },
      { nombre: 'Ciencia Ficción', icon: '🚀' },
      { nombre: 'Misterio', icon: '🔍' },
      { nombre: 'Romance', icon: '💕' },
      { nombre: 'Aventura', icon: '🗺️' },
      { nombre: 'Thriller', icon: '⚡' },
      { nombre: 'Drama', icon: '🎭' }
    ];

    this.inicializar();
  }

  inicializar() {
    this.actualizarAutenticacion();
    this.configurarEventos();
    this.mostrarGeneros();
  }

  actualizarAutenticacion() {
    if (this.token && this.usuario) {
      if (this.elementos.infoUsuario) this.elementos.infoUsuario.style.display = 'inline';
      if (this.elementos.infoUsuario) this.elementos.infoUsuario.textContent = '👤 ' + this.usuario;
      if (this.elementos.enlaceLogin) this.elementos.enlaceLogin.style.display = 'none';
      if (this.elementos.enlaceRegistro) this.elementos.enlaceRegistro.style.display = 'none';
      if (this.elementos.botonLogout) this.elementos.botonLogout.style.display = 'inline-block';
    } else {
      if (this.elementos.infoUsuario) this.elementos.infoUsuario.style.display = 'none';
      if (this.elementos.enlaceLogin) this.elementos.enlaceLogin.style.display = 'inline-block';
      if (this.elementos.enlaceRegistro) this.elementos.enlaceRegistro.style.display = 'inline-block';
      if (this.elementos.botonLogout) this.elementos.botonLogout.style.display = 'none';
    }
  }

  configurarEventos() {
    if (this.elementos.botonLogout) {
      this.elementos.botonLogout.addEventListener('click', () => this.cerrarSesion());
    }
  }

  mostrarGeneros() {
    const grid = this.elementos.cuadriculaGeneros;
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    this.generosDisponibles.forEach(genero => {
      const tarjeta = this.crearTarjetaGenero(genero);
      grid.appendChild(tarjeta);
    });
  }

  crearTarjetaGenero(genero) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-genero';

    const icono = document.createElement('div');
    icono.className = 'icono-genero';
    icono.textContent = genero.icon;

    const nombre = document.createElement('h3');
    nombre.className = 'nombre-genero';
    nombre.textContent = genero.nombre;

    const boton = document.createElement('a');
    boton.href = 'libros.html?genero=' + encodeURIComponent(genero.nombre);
    boton.className = 'boton boton-primario';
    boton.textContent = 'Ver libros';

    tarjeta.appendChild(icono);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(boton);

    return tarjeta;
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GestorGeneros();
});
