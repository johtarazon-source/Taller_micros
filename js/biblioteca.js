class GestorBiblioteca {
  constructor() {
    this.token = localStorage.getItem('token');
    this.usuario = localStorage.getItem('usuario');
    this.alquileres = [];

    this.elementos = {
      infoUsuario: document.getElementById('info-usuario'),
      enlaceLogin: document.getElementById('enlace-login'),
      enlaceRegistro: document.getElementById('enlace-registro'),
      botonLogout: document.getElementById('boton-cerrar-sesion'),
      listaAlquileres: document.getElementById('lista-alquileres')
    };

    if (!this.token) {
      this.redirigirALogin();
      return;
    }

    this.inicializar();
  }

  redirigirALogin() {
    modal.info('Acceso Denegado', 'Debes iniciar sesión para acceder a tu biblioteca', () => {
      window.location.href = 'login.html';
    });
  }

  inicializar() {
    this.actualizarAutenticacion();
    this.configurarEventos();
    this.cargarAlquileres();
  }

  actualizarAutenticacion() {
    if (this.token && this.usuario) {
      if (this.elementos.infoUsuario) this.elementos.infoUsuario.style.display = 'inline';
      if (this.elementos.infoUsuario) this.elementos.infoUsuario.textContent = '👤 ' + this.usuario;
      if (this.elementos.enlaceLogin) this.elementos.enlaceLogin.style.display = 'none';
      if (this.elementos.enlaceRegistro) this.elementos.enlaceRegistro.style.display = 'none';
      if (this.elementos.botonLogout) this.elementos.botonLogout.style.display = 'inline-block';
    }
  }

  configurarEventos() {
    if (this.elementos.botonLogout) {
      this.elementos.botonLogout.addEventListener('click', () => this.cerrarSesion());
    }
  }

  cargarAlquileres() {
    const alquileres = localStorage.getItem('alquileres');
    this.alquileres = alquileres ? JSON.parse(alquileres) : [];
    this.mostrarAlquileres();
  }

  mostrarAlquileres() {
    const lista = this.elementos.listaAlquileres;
    if (!lista) return;

    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }

    if (this.alquileres.length === 0) {
      const vacio = document.createElement('div');
      vacio.className = 'estado-vacio';
      vacio.textContent = 'No tienes libros alquilados. ¡Ve a descubrir libros!';
      lista.appendChild(vacio);
      return;
    }

    this.alquileres.forEach((alquiler, indice) => {
      const tarjeta = this.crearTarjetaAlquiler(alquiler, indice);
      lista.appendChild(tarjeta);
    });
  }

  crearTarjetaAlquiler(alquiler, indice) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-alquiler';

    const titulo = document.createElement('h3');
    titulo.textContent = alquiler.titulo;

    const autor = document.createElement('p');
    autor.className = 'autor-alquiler';
    autor.textContent = 'Por ' + alquiler.autor;

    const info = document.createElement('div');
    info.className = 'info-alquiler';

    const dias = document.createElement('span');
    dias.textContent = 'Días: ' + alquiler.dias;

    const precio = document.createElement('span');
    precio.className = 'precio-alquiler';
    precio.textContent = '$' + this.formatearPrecio(alquiler.precio_total);

    info.appendChild(dias);
    info.appendChild(precio);

    const fechas = document.createElement('div');
    fechas.className = 'fechas-alquiler';

    const fechaAlquiler = document.createElement('p');
    fechaAlquiler.textContent = 'Alquiler: ' + alquiler.fecha_alquiler;

    const fechaEntrega = document.createElement('p');
    fechaEntrega.className = 'fecha-entrega';
    fechaEntrega.textContent = 'Entrega: ' + alquiler.fecha_entrega;

    fechas.appendChild(fechaAlquiler);
    fechas.appendChild(fechaEntrega);

    const boton = document.createElement('button');
    boton.className = 'boton boton-peligro';
    boton.textContent = 'Devolver libro';
    boton.addEventListener('click', () => this.devolverLibro(indice));

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(autor);
    tarjeta.appendChild(info);
    tarjeta.appendChild(fechas);
    tarjeta.appendChild(boton);

    return tarjeta;
  }

  devolverLibro(indice) {
    const alquiler = this.alquileres[indice];
    modal.confirm('Confirmar Devolución', '¿Deseas devolver "' + alquiler.titulo + '"?', () => {
      this.alquileres.splice(indice, 1);
      localStorage.setItem('alquileres', JSON.stringify(this.alquileres));
      this.mostrarAlquileres();
      modal.success('Éxito', 'Libro devuelto exitosamente');
    });
  }

  formatearPrecio(precio) {
    if (typeof precio === 'string') {
      precio = parseFloat(precio);
    }
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GestorBiblioteca();
});
