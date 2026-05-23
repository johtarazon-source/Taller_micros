class GestorLibrosPagina {
  constructor() {
    this.libros = [];
    this.librosFiltrados = [];
    this.token = localStorage.getItem('token');
    this.usuario = localStorage.getItem('usuario');

    this.librosEjemplo = [
      {
        id: 1,
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        anio: 1605,
        genero: 'Ficción',
        precio: 45000,
        imagen: 'https://covers.openlibrary.org/b/id/7878916-M.jpg',
        descripcion: 'La obra maestra de la literatura española'
      },
      {
        id: 2,
        titulo: 'Harry Potter y la Piedra Filosofal',
        autor: 'J.K. Rowling',
        anio: 1997,
        genero: 'Fantasía',
        precio: 55000,
        imagen: 'https://covers.openlibrary.org/b/id/8235379-M.jpg',
        descripcion: 'El inicio de la saga Harry Potter'
      },
      {
        id: 3,
        titulo: 'Dune',
        autor: 'Frank Herbert',
        anio: 1965,
        genero: 'Ciencia Ficción',
        precio: 65000,
        imagen: 'https://covers.openlibrary.org/b/id/8272216-M.jpg',
        descripcion: 'Epopeya de ciencia ficción clásica'
      },
      {
        id: 4,
        titulo: 'Sherlock Holmes: Estudio en Escarlata',
        autor: 'Arthur Conan Doyle',
        anio: 1887,
        genero: 'Misterio',
        precio: 38000,
        imagen: 'https://covers.openlibrary.org/b/id/7968956-M.jpg',
        descripcion: 'Primera aventura del famoso detective'
      },
      {
        id: 5,
        titulo: 'Orgullo y Prejuicio',
        autor: 'Jane Austen',
        anio: 1813,
        genero: 'Romance',
        precio: 42000,
        imagen: 'https://covers.openlibrary.org/b/id/8253039-M.jpg',
        descripcion: 'Novela romántica clásica inglesa'
      },
      {
        id: 6,
        titulo: 'La Isla del Tesoro',
        autor: 'Robert Louis Stevenson',
        anio: 1882,
        genero: 'Aventura',
        precio: 40000,
        imagen: 'https://covers.openlibrary.org/b/id/8380087-M.jpg',
        descripcion: 'Aventura de piratas y tesoros'
      },
      {
        id: 7,
        titulo: '1984',
        autor: 'George Orwell',
        anio: 1949,
        genero: 'Ficción',
        precio: 48000,
        imagen: 'https://covers.openlibrary.org/b/id/7927502-M.jpg',
        descripcion: 'Distopía futurista perturbadora'
      },
      {
        id: 8,
        titulo: 'El Hobbit',
        autor: 'J.R.R. Tolkien',
        anio: 1937,
        genero: 'Fantasía',
        precio: 52000,
        imagen: 'https://covers.openlibrary.org/b/id/8416031-M.jpg',
        descripcion: 'La aventura que inicia El Señor de los Anillos'
      },
      {
        id: 9,
        titulo: 'Cien años de Soledad',
        autor: 'Gabriel García Márquez',
        anio: 1967,
        genero: 'Realismo Mágico',
        precio: 51000,
        imagen: 'https://covers.openlibrary.org/b/id/8415164-M.jpg',
        descripcion: 'Saga de la familia Buendía en Macondo'
      },
      {
        id: 10,
        titulo: 'El Código Da Vinci',
        autor: 'Dan Brown',
        anio: 2003,
        genero: 'Thriller',
        precio: 49000,
        imagen: 'https://covers.openlibrary.org/b/id/8413546-M.jpg',
        descripcion: 'Misterio de arte y religión'
      }
    ];

    this.inicializar();
  }

  inicializar() {
    this.libros = [...this.librosEjemplo];
    this.librosFiltrados = [...this.libros];
    this.actualizarAutenticacion();
    this.configurarEventos();
    this.mostrarLibros();
  }

  actualizarAutenticacion() {
    const infoUsuario = document.getElementById('info-usuario');
    const enlaceLogin = document.getElementById('enlace-login');
    const enlaceRegistro = document.getElementById('enlace-registro');
    const botonLogout = document.getElementById('boton-cerrar-sesion');

    if (this.token && this.usuario) {
      if (infoUsuario) infoUsuario.style.display = 'inline';
      if (infoUsuario) infoUsuario.textContent = '👤 ' + this.usuario;
      if (enlaceLogin) enlaceLogin.style.display = 'none';
      if (enlaceRegistro) enlaceRegistro.style.display = 'none';
      if (botonLogout) botonLogout.style.display = 'inline-block';
    } else {
      if (infoUsuario) infoUsuario.style.display = 'none';
      if (enlaceLogin) enlaceLogin.style.display = 'inline-block';
      if (enlaceRegistro) enlaceRegistro.style.display = 'inline-block';
      if (botonLogout) botonLogout.style.display = 'none';
    }
  }

  configurarEventos() {
    const searchInput = document.getElementById('buscar-libros');
    const sortSelect = document.getElementById('ordenar-libros');
    const botonLogout = document.getElementById('boton-cerrar-sesion');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.buscarLibros(e.target.value));
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.ordenarLibros(e.target.value));
    }

    if (botonLogout) {
      botonLogout.addEventListener('click', () => this.cerrarSesion());
    }
  }

  buscarLibros(termino) {
    const termLower = termino.toLowerCase();
    this.librosFiltrados = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(termLower) ||
      libro.autor.toLowerCase().includes(termLower)
    );
    this.mostrarLibros();
  }

  ordenarLibros(criterio) {
    this.librosFiltrados.sort((a, b) => {
      if (criterio === 'titulo') {
        return a.titulo.localeCompare(b.titulo);
      } else if (criterio === 'autor') {
        return a.autor.localeCompare(b.autor);
      } else if (criterio === 'anio') {
        return b.anio - a.anio;
      } else if (criterio === 'precio') {
        return a.precio - b.precio;
      }
      return 0;
    });
    this.mostrarLibros();
  }

  mostrarLibros() {
    const grid = document.getElementById('cuadricula-libros');
    if (!grid) return;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const contador = document.getElementById('contador-libros');
    if (contador) {
      contador.textContent = `Se encontraron ${this.librosFiltrados.length} libro(s)`;
    }

    if (this.librosFiltrados.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'mensaje-vacio';
      emptyMsg.textContent = 'No se encontraron libros';
      grid.appendChild(emptyMsg);
      return;
    }

    this.librosFiltrados.forEach(libro => {
      const tarjeta = this.crearTarjetaLibro(libro);
      grid.appendChild(tarjeta);
    });
  }

  crearTarjetaLibro(libro) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-libro';

    const portada = document.createElement('div');
    portada.className = 'portada-libro';
    const img = document.createElement('img');
    img.src = libro.imagen;
    img.alt = libro.titulo;
    img.onerror = function() { this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"><rect fill="%23ddd" width="100" height="150"/><text x="50" y="75" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">Sin imagen</text></svg>'; };
    portada.appendChild(img);
    tarjeta.appendChild(portada);

    const contenido = document.createElement('div');
    contenido.className = 'contenido-libro';

    const titulo = document.createElement('h3');
    titulo.className = 'titulo-libro';
    titulo.textContent = libro.titulo;
    contenido.appendChild(titulo);

    const autor = document.createElement('p');
    autor.className = 'autor-libro';
    autor.textContent = 'Por ' + libro.autor;
    contenido.appendChild(autor);

    const detalles = document.createElement('div');
    detalles.className = 'detalles-libro';

    const anio = document.createElement('span');
    anio.className = 'anio-libro';
    anio.textContent = String(libro.anio);
    detalles.appendChild(anio);

    const genero = document.createElement('span');
    genero.className = 'genero-libro';
    genero.textContent = libro.genero;
    detalles.appendChild(genero);

    contenido.appendChild(detalles);

    const precio = document.createElement('div');
    precio.className = 'precio-libro';
    precio.textContent = '$' + this.formatearPrecio(libro.precio.toString()) + '/día';
    contenido.appendChild(precio);

    const boton = document.createElement('button');
    boton.className = 'boton boton-alquilar';
    boton.textContent = 'Alquilar';
    boton.addEventListener('click', () => this.alquilarLibro(libro));
    contenido.appendChild(boton);

    tarjeta.appendChild(contenido);
    return tarjeta;
  }

  alquilarLibro(libro) {
    if (!this.token) {
      modal.info('Acceso Denegado', 'Debes iniciar sesión para alquilar un libro', () => {
        window.location.href = 'login.html';
      });
      return;
    }

    modal.prompt('Alquilar Libro', '¿Cuántos días deseas alquilar "' + libro.titulo + '"? (Máximo 30 días)', '7', (dias) => {
      const diasNum = parseInt(dias);
      if (isNaN(diasNum) || diasNum < 1 || diasNum > 30) {
        modal.warning('Entrada Inválida', 'Ingresa un número válido entre 1 y 30 días');
        return;
      }

      const precioTotal = libro.precio * diasNum;
      const alquiler = {
        id_libro: libro.id,
        titulo: libro.titulo,
        autor: libro.autor,
        dias: diasNum,
        precio_dia: libro.precio,
        precio_total: precioTotal,
        fecha_alquiler: new Date().toLocaleDateString('es-CO'),
        fecha_entrega: new Date(Date.now() + diasNum * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')
      };

      const alquileres = JSON.parse(localStorage.getItem('alquileres') || '[]');
      alquileres.push(alquiler);
      localStorage.setItem('alquileres', JSON.stringify(alquileres));

      const precioFormato = this.formatearPrecio(precioTotal.toString());
      const mensaje = 'Libro: ' + libro.titulo + '\nDías: ' + diasNum + '\nPrecio por día: $' + this.formatearPrecio(libro.precio.toString()) + '\nTotal: $' + precioFormato + '\n\nEntrega: ' + alquiler.fecha_entrega;
      modal.success('¡Alquiler Exitoso!', mensaje);
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  }

  formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GestorLibrosPagina();
});
