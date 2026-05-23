// app.js - Lógica de la página de inicio

document.addEventListener('DOMContentLoaded', async () => {
    actualizarEncabezado();
    await cargarLibrosDestacados();
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

async function cargarLibrosDestacados() {
    const container = document.getElementById('books-grid');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading">Cargando libros...</div>';
        const data = await api.obtenerLibros({ destacados: true, limite: 6 });

        if (data.error) {
            mostrarError('Error al cargar libros: ' + data.error);
            return;
        }

        if (!data.libros || data.libros.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No hay libros disponibles</h3></div>';
            return;
        }

        container.innerHTML = data.libros.map(libro => crearTarjetaLibro(libro)).join('');
        agregarEventosAlquilar();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar libros');
    }
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
        setTimeout(() => {
            window.location.href = 'biblioteca.html';
        }, 1500);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al alquilar libro');
    }
}

function mostrarError(mensaje) {
    console.error(mensaje);
    const notif = document.createElement('div');
    notif.className = 'error';
    notif.textContent = mensaje;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.zIndex = '9999';
    notif.style.maxWidth = '400px';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
}

function mostrarExito(mensaje) {
    console.log(mensaje);
    const notif = document.createElement('div');
    notif.className = 'success';
    notif.textContent = mensaje;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.zIndex = '9999';
    notif.style.maxWidth = '400px';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
}
