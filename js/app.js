/**
 * Aplicación Gestor de Libros v2.0
 * Orientada a objetos con uso completo del DOM
 */

class GestorLibros {
    constructor() {
        this.token = localStorage.getItem('token');
        this.usuario = null;
        this.libros = [];
        this.elementos = {
            infoUsuario: document.getElementById('info-usuario'),
            enlaceLogin: document.getElementById('enlace-login'),
            enlaceRegistro: document.getElementById('enlace-registro'),
            botonCerrarSesion: document.getElementById('boton-cerrar-sesion'),
            cuadriculaLibros: document.getElementById('cuadricula-libros')
        };

        this.inicializar();
    }

    inicializar() {
        console.log('🚀 Inicializando Gestor de Libros v2.0');

        this.verificarAutenticacion();
        this.configurarEventos();

        if (this.elementos.cuadriculaLibros) {
            this.cargarLibros();
        }
    }

    verificarAutenticacion() {
        if (this.token) {
            this.mostrarUsuarioAutenticado();
        } else {
            this.mostrarUsuarioNoAutenticado();
        }
    }

    mostrarUsuarioAutenticado() {
        this.elementos.enlaceLogin.style.display = 'none';
        this.elementos.enlaceRegistro.style.display = 'none';
        this.elementos.botonCerrarSesion.style.display = 'block';
        this.elementos.infoUsuario.style.display = 'inline';
        this.elementos.infoUsuario.textContent = '✓ Bienvenido';
        this.elementos.infoUsuario.classList.add('usuario-autenticado');
    }

    mostrarUsuarioNoAutenticado() {
        this.elementos.enlaceLogin.style.display = 'inline-flex';
        this.elementos.enlaceRegistro.style.display = 'inline-flex';
        this.elementos.botonCerrarSesion.style.display = 'none';
        this.elementos.infoUsuario.style.display = 'none';
    }

    configurarEventos() {
        if (this.elementos.botonCerrarSesion) {
            this.elementos.botonCerrarSesion.addEventListener('click',
                (e) => this.cerrarSesion(e)
            );
        }
    }

    cerrarSesion(evento) {
        evento.preventDefault();
        localStorage.removeItem('token');
        location.reload();
    }

    async cargarLibros() {
        try {
            this.mostrarCargando();
            const datos = await ClienteAPI.obtenerLibros();

            if (datos.success && datos.libros) {
                this.libros = datos.libros.slice(0, 6);
                this.mostrarLibros();
            } else {
                this.mostrarError('No se pudieron cargar los libros');
            }
        } catch (error) {
            console.error('Error al cargar libros:', error);
            this.mostrarError('Error de conexión');
        }
    }

    mostrarCargando() {
        this.elementos.cuadriculaLibros.innerHTML = '';

        const contenedor = document.createElement('div');
        contenedor.className = 'cargando';
        contenedor.innerHTML = `
            <div class="spinner-carga"></div>
            <p>Cargando libros...</p>
        `;

        this.elementos.cuadriculaLibros.appendChild(contenedor);
    }

    mostrarError(mensaje) {
        this.elementos.cuadriculaLibros.innerHTML = '';

        const div = document.createElement('div');
        div.className = 'error';
        div.textContent = mensaje;

        this.elementos.cuadriculaLibros.appendChild(div);
    }

    mostrarLibros() {
        this.elementos.cuadriculaLibros.innerHTML = '';

        this.libros.forEach(libro => {
            const tarjeta = new TarjetaLibro(libro, this.token);
            this.elementos.cuadriculaLibros.appendChild(tarjeta.elemento);
        });
    }
}

/**
 * Clase para representar una tarjeta de libro
 */
class TarjetaLibro {
    constructor(libro, token) {
        this.libro = libro;
        this.token = token;
        this.elemento = this.crear();
    }

    crear() {
        const contenedor = document.createElement('div');
        contenedor.className = 'tarjeta-libro';

        // Crear portada
        const portada = this.crearPortada();

        // Crear información
        const info = this.crearInfo();

        // Crear botón
        const boton = this.crearBoton();

        contenedor.appendChild(portada);
        contenedor.appendChild(info);
        contenedor.appendChild(boton);

        return contenedor;
    }

    crearPortada() {
        const img = document.createElement('img');
        img.src = this.libro.portada_url;
        img.alt = this.libro.titulo;
        img.className = 'portada-libro';
        img.onerror = () => this.manejarErrorImagen(img);

        return img;
    }

    manejarErrorImagen(img) {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23e0e0e0" width="200" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3ELibro%3C/text%3E%3C/svg%3E';
    }

    crearInfo() {
        const div = document.createElement('div');
        div.className = 'info-libro';

        // Título
        const titulo = document.createElement('h3');
        titulo.className = 'titulo-libro';
        titulo.textContent = this.libro.titulo;

        // Autor
        const autor = document.createElement('p');
        autor.className = 'autor-libro';
        autor.textContent = this.libro.autor;

        // Año
        const anio = document.createElement('p');
        anio.className = 'anio-libro';
        anio.textContent = this.libro.anio_publicacion || 'Sin año';

        // Género
        const genero = document.createElement('span');
        genero.className = 'genero-libro';
        genero.textContent = this.libro.genero;

        div.appendChild(titulo);
        div.appendChild(autor);
        div.appendChild(anio);
        div.appendChild(genero);

        return div;
    }

    crearBoton() {
        const boton = document.createElement('button');
        boton.className = 'accion-libro';
        boton.textContent = 'Alquilar';
        boton.setAttribute('aria-label', `Alquilar ${this.libro.titulo}`);

        boton.addEventListener('click', (e) => this.manejarAlquiler(e));

        return boton;
    }

    manejarAlquiler(evento) {
        evento.preventDefault();

        if (!this.token) {
            window.location.href = 'login.html';
            return;
        }

        // Guardar datos en sessionStorage para la siguiente página
        sessionStorage.setItem('libro-seleccionado', JSON.stringify(this.libro));
        window.location.href = 'libros.html?alquilar=' + this.libro.id;
    }
}

/**
 * Inicializar aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    window.gestorLibros = new GestorLibros();
});
