// generos.js - Lógica para la página de géneros

document.addEventListener('DOMContentLoaded', async () => {
    actualizarEncabezado();
    await cargarGeneros();
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

async function cargarGeneros() {
    const container = document.getElementById('genres-grid');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading">Cargando géneros...</div>';
        const data = await api.obtenerGeneros();

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        if (!data.generos || data.generos.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No hay géneros disponibles</h3></div>';
            return;
        }

        container.innerHTML = data.generos.map(genero => crearTarjetaGenero(genero)).join('');
        agregarEventosGeneros();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar géneros');
    }
}

function crearTarjetaGenero(genero) {
    return `
        <div class="genre-card" data-genre="${genero}">
            <div class="genre-name">${genero}</div>
        </div>
    `;
}

function agregarEventosGeneros() {
    document.querySelectorAll('.genre-card').forEach(card => {
        card.addEventListener('click', function() {
            const genero = this.getAttribute('data-genre');
            cargarLibrosPorGenero(genero);
        });
    });
}

async function cargarLibrosPorGenero(genero) {
    try {
        const data = await api.obtenerLibrosPorGenero(genero);
        mostrarLibrosPorGenero(data, genero);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar libros por género');
    }
}

function mostrarLibrosPorGenero(data, genero) {
    const container = document.getElementById('genres-grid');
    const parent = container.parentElement;

    if (data.error || !data.libros || data.libros.length === 0) {
        parent.innerHTML = `
            <h2>Libros del género: ${genero}</h2>
            <div class="empty-state"><h3>No hay libros en este género</h3></div>
            <button class="btn btn-primary" onclick="location.reload()">Volver a géneros</button>
        `;
        return;
    }

    const html = `
        <h2>Libros del género: ${genero}</h2>
        <button class="btn btn-primary" onclick="location.reload()" style="margin-bottom: 2rem;">Volver a géneros</button>
        <div class="books-grid" id="books-by-genre">
            ${data.libros.map(libro => `
                <div class="book-card">
                    <img src="${libro.portada_url || 'https://via.placeholder.com/200x250'}" alt="${libro.titulo}" class="book-cover">
                    <div class="book-info">
                        <div class="book-title">${libro.titulo}</div>
                        <div class="book-author">${libro.autor}</div>
                        <div class="book-year">${libro.anio_publicacion}</div>
                        <button class="book-action" data-id="${libro.id}" data-title="${libro.titulo}">
                            Alquilar
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    parent.innerHTML = html;
    agregarEventosAlquilar();
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
    alert(mensaje);
}

function mostrarExito(mensaje) {
    console.log(mensaje);
    alert(mensaje);
}
