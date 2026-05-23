// libros.js - Lógica para la página de libros

let librosFiltrados = [];

document.addEventListener('DOMContentLoaded', async () => {
    actualizarEncabezado();
    await cargarLibros();
    agregarEventosBusqueda();
    agregarEventosOrdenamiento();
});

function actualizarEncabezado() {
    const userInfo = document.getElementById('user-info');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (api.isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (userInfo) {
            userInfo.textContent = `Bienvenido, ${user.nombre || 'Usuario'}`;
            userInfo.style.display = 'block';
        }
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-flex';
            logoutBtn.addEventListener('click', manejarLogout);
        }
    } else {
        if (userInfo) userInfo.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline-flex';
        if (signupLink) signupLink.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function manejarLogout() {
    api.logout();
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

async function cargarLibros() {
    const container = document.getElementById('books-grid');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading">Cargando libros...</div>';
        const data = await api.obtenerLibros();

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        librosFiltrados = data.libros || [];
        mostrarLibros(librosFiltrados);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar libros');
    }
}

function mostrarLibros(libros) {
    const container = document.getElementById('books-grid');

    if (!libros || libros.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No hay libros disponibles</h3></div>';
        return;
    }

    container.innerHTML = libros.map(libro => crearTarjetaLibro(libro)).join('');
    agregarEventosAlquilar();
}

function crearTarjetaLibro(libro) {
    return `
        <div class="book-card">
            <img src="${libro.portada_url || 'https://via.placeholder.com/200x250'}" alt="${libro.titulo}" class="book-cover">
            <div class="book-info">
                <div class="book-title">${libro.titulo}</div>
                <div class="book-author">${libro.autor}</div>
                <div class="book-year">${libro.anio_publicacion}</div>
                ${libro.genero ? `<span class="book-genre">${libro.genero}</span>` : ''}
                <button class="book-action" data-id="${libro.id}" data-title="${libro.titulo}">
                    Alquilar
                </button>
            </div>
        </div>
    `;
}

function agregarEventosAlquilar() {
    document.querySelectorAll('.book-action').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!api.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            const libroId = this.getAttribute('data-id');
            const titulo = this.getAttribute('data-title');
            abrirDialogoAlquiler(libroId, titulo);
        });
    });
}

function abrirDialogoAlquiler(libroId, titulo) {
    const dias = prompt(`¿Por cuántos días deseas alquilar "${titulo}"?\n(Máximo 30 días)`, '7');

    if (dias === null) return;

    const diasNum = parseInt(dias);
    if (isNaN(diasNum) || diasNum < 1 || diasNum > 30) {
        alert('Ingresa un número entre 1 y 30');
        return;
    }

    alquilarLibro(libroId, diasNum);
}

async function alquilarLibro(libroId, diasAlquiler) {
    try {
        const data = await api.alquilarLibro(libroId, diasAlquiler);

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        mostrarExito('Libro alquilado exitosamente');
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al alquilar libro');
    }
}

function agregarEventosBusqueda() {
    const searchInput = document.getElementById('search-books');
    if (searchInput) {
        searchInput.addEventListener('input', filtrarLibros);
    }
}

function filtrarLibros() {
    const searchTerm = document.getElementById('search-books').value.toLowerCase();

    const filtrados = librosFiltrados.filter(libro =>
        libro.titulo.toLowerCase().includes(searchTerm) ||
        libro.autor.toLowerCase().includes(searchTerm) ||
        (libro.genero && libro.genero.toLowerCase().includes(searchTerm))
    );

    mostrarLibros(filtrados);
}

function agregarEventosOrdenamiento() {
    const sortSelect = document.getElementById('sort-books');
    if (sortSelect) {
        sortSelect.addEventListener('change', ordenarLibros);
    }
}

function ordenarLibros() {
    const sortValue = document.getElementById('sort-books').value;
    let ordenados = [...librosFiltrados];

    switch(sortValue) {
        case 'titulo':
            ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case 'autor':
            ordenados.sort((a, b) => a.autor.localeCompare(b.autor));
            break;
        case 'anio':
            ordenados.sort((a, b) => b.anio_publicacion - a.anio_publicacion);
            break;
    }

    mostrarLibros(ordenados);
}

function mostrarError(mensaje) {
    console.error(mensaje);
    alert(mensaje);
}

function mostrarExito(mensaje) {
    console.log(mensaje);
    alert(mensaje);
}
