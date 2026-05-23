// biblioteca.js - Lógica para la página de mi biblioteca

document.addEventListener('DOMContentLoaded', async () => {
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    await cargarAlquileres();
});

async function cargarAlquileres() {
    const container = document.getElementById('rentals-list');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading">Cargando tus alquileres...</div>';
        const data = await api.obtenerMisAlquileres();

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        if (!data.alquileres || data.alquileres.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No tienes libros alquilados</h3><p>Explora nuestra colección para alquilar libros</p></div>';
            return;
        }

        container.innerHTML = data.alquileres.map(alquiler => crearTarjetaAlquiler(alquiler)).join('');
        agregarEventosDevolver();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar alquileres');
    }
}

function crearTarjetaAlquiler(alquiler) {
    const fechaFin = new Date(alquiler.fecha_vencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
    const vencido = diasRestantes < 0;

    return `
        <div class="rental-card">
            <img src="${alquiler.portada_url || 'https://via.placeholder.com/100x150'}" alt="${alquiler.titulo}" class="rental-cover">
            <div class="rental-details">
                <div class="rental-title">${alquiler.titulo}</div>
                <div class="rental-info">Autor: ${alquiler.autor}</div>
                <div class="rental-info">Género: ${alquiler.genero}</div>
                <div class="rental-date">
                    Alquilado el: ${new Date(alquiler.fecha_inicio).toLocaleDateString()}
                </div>
                <div class="rental-date" style="${vencido ? 'color: #e74c3c; font-weight: 600;' : ''}">
                    ${vencido ? 'VENCIDO' : `Vencimiento: ${fechaFin.toLocaleDateString()} (${diasRestantes} días restantes)`}
                </div>
                <div class="rental-actions">
                    <button class="btn-return" data-id="${alquiler.id}">Devolver</button>
                </div>
            </div>
        </div>
    `;
}

function agregarEventosDevolver() {
    document.querySelectorAll('.btn-return').forEach(btn => {
        btn.addEventListener('click', function() {
            const alquilerId = this.getAttribute('data-id');
            confirmarDevolucion(alquilerId);
        });
    });
}

function confirmarDevolucion(alquilerId) {
    if (confirm('¿Estás seguro de que deseas devolver este libro?')) {
        devolverLibro(alquilerId);
    }
}

async function devolverLibro(alquilerId) {
    try {
        const data = await api.devolverLibro(alquilerId);

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        mostrarExito('Libro devuelto exitosamente');
        setTimeout(() => {
            cargarAlquileres();
        }, 1000);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al devolver libro');
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
