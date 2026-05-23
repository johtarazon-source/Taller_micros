/**
 * Cliente API RESTful
 * Gestión de solicitudes HTTP a la API del Gestor de Libros
 */

class ClienteAPI {
    static API_BASE = 'http://localhost/taller_micros/Taller_micros/api';
    static TIMEOUT = 5000;

    /**
     * Obtener token del almacenamiento local
     */
    static obtenerToken() {
        return localStorage.getItem('token') || null;
    }

    /**
     * Construir encabezados HTTP
     */
    static obtenerEncabezados(incluirAuth = true) {
        const encabezados = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (incluirAuth) {
            const token = this.obtenerToken();
            if (token) {
                encabezados['Authorization'] = `Bearer ${token}`;
            }
        }

        return encabezados;
    }

    /**
     * Realizar solicitud GET
     */
    static async obtener(ruta, parametros = {}) {
        try {
            const url = new URL(`${this.API_BASE}${ruta}`);

            Object.keys(parametros).forEach(clave => {
                if (parametros[clave] !== null && parametros[clave] !== undefined) {
                    url.searchParams.append(clave, parametros[clave]);
                }
            });

            const respuesta = await this.realizarSolicitud(url.toString(), {
                method: 'GET',
                headers: this.obtenerEncabezados()
            });

            return respuesta;
        } catch (error) {
            return this.manejarError(error, 'GET');
        }
    }

    /**
     * Realizar solicitud POST
     */
    static async enviar(ruta, datos = {}) {
        try {
            const respuesta = await this.realizarSolicitud(`${this.API_BASE}${ruta}`, {
                method: 'POST',
                headers: this.obtenerEncabezados(),
                body: JSON.stringify(datos)
            });

            return respuesta;
        } catch (error) {
            return this.manejarError(error, 'POST');
        }
    }

    /**
     * Realizar solicitud PUT
     */
    static async actualizar(ruta, datos = {}) {
        try {
            const respuesta = await this.realizarSolicitud(`${this.API_BASE}${ruta}`, {
                method: 'PUT',
                headers: this.obtenerEncabezados(),
                body: JSON.stringify(datos)
            });

            return respuesta;
        } catch (error) {
            return this.manejarError(error, 'PUT');
        }
    }

    /**
     * Realizar solicitud DELETE
     */
    static async eliminar(ruta) {
        try {
            const respuesta = await this.realizarSolicitud(`${this.API_BASE}${ruta}`, {
                method: 'DELETE',
                headers: this.obtenerEncabezados()
            });

            return respuesta;
        } catch (error) {
            return this.manejarError(error, 'DELETE');
        }
    }

    /**
     * Realizar la solicitud HTTP con timeout
     */
    static async realizarSolicitud(url, opciones) {
        const controlador = new AbortController();
        const timeout = setTimeout(() => controlador.abort(), this.TIMEOUT);

        try {
            const respuesta = await fetch(url, {
                ...opciones,
                signal: controlador.signal
            });

            clearTimeout(timeout);

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                return {
                    exito: false,
                    error: datos.error || 'Error en la solicitud',
                    codigo: respuesta.status
                };
            }

            return datos;
        } catch (error) {
            clearTimeout(timeout);
            throw error;
        }
    }

    /**
     * Manejar errores de solicitud
     */
    static manejarError(error, metodo) {
        console.error(`Error en solicitud ${metodo}:`, error);

        if (error.name === 'AbortError') {
            return {
                exito: false,
                error: 'La solicitud tardó demasiado',
                codigo: 408
            };
        }

        return {
            exito: false,
            error: 'Error de conexión con el servidor',
            codigo: 0
        };
    }

    // ============================================
    // MÉTODOS DE USUARIOS
    // ============================================

    /**
     * Registrar nuevo usuario
     */
    static async registrar(nombre, email, contrasena) {
        return this.enviar('/usuarios', {
            nombre,
            email,
            contrasena
        });
    }

    /**
     * Registrar un nuevo usuario
     */
    static async registro(nombre, email, contrasena) {
        return this.enviar('/usuarios.php?action=registro', {
            nombre,
            email,
            contrasena
        });
    }

    /**
     * Iniciar sesión
     */
    static async login(email, password) {
        const respuesta = await this.enviar('/usuarios.php?action=login', {
            email,
            password
        });

        if (respuesta.success && respuesta.token) {
            localStorage.setItem('token', respuesta.token);
        }

        return respuesta;
    }

    /**
     * Obtener perfil del usuario actual
     */
    static async obtenerPerfil() {
        return this.obtener('/usuarios/perfil');
    }

    /**
     * Cerrar sesión
     */
    static cerrarSesion() {
        localStorage.removeItem('token');
    }

    // ============================================
    // MÉTODOS DE LIBROS
    // ============================================

    /**
     * Obtener todos los libros con filtros opcionales
     */
    static async obtenerLibros(filtros = {}) {
        return this.obtener('/libros.php', filtros);
    }

    /**
     * Obtener un libro por ID
     */
    static async obtenerLibro(id) {
        return this.obtener('/libros.php', { obtener: 'true', id });
    }

    /**
     * Obtener libros por género
     */
    static async obtenerLibrosPorGenero(genero) {
        return this.obtener('/libros.php', { porGenero: 'true', genero });
    }

    /**
     * Buscar libros
     */
    static async buscarLibros(termino) {
        return this.obtener('/libros.php', { busqueda: termino });
    }

    /**
     * Obtener todos los géneros
     */
    static async obtenerGeneros() {
        return this.obtener('/libros.php', { generos: 'true' });
    }

    /**
     * Sincronizar libros gratis desde Google Books
     */
    static async sincronizarLibros(generos = []) {
        return this.enviar('/libros/sincronizar', { generos });
    }

    // ============================================
    // MÉTODOS DE ALQUILERES
    // ============================================

    /**
     * Alquilar un libro
     */
    static async alquilarLibro(idLibro, dias) {
        return this.enviar('/alquileres.php?action=crear', {
            id_libro: idLibro,
            dias
        });
    }

    /**
     * Obtener alquileres del usuario
     */
    static async obtenerAlquileres(estado = null) {
        const parametros = { action: 'lista' };
        if (estado) {
            parametros.estado = estado;
        }
        return this.obtener('/alquileres.php', parametros);
    }

    /**
     * Obtener alquileres activos
     */
    static async obtenerAlquileresActivos() {
        return this.obtener('/alquileres.php', { action: 'activos' });
    }

    /**
     * Devolver un libro (eliminar alquiler)
     */
    static async devolverLibro(idAlquiler) {
        return this.eliminar(`/alquileres.php?action=devolver&id=${idAlquiler}`);
    }

    /**
     * Renovar un alquiler
     */
    static async renovarAlquiler(idAlquiler, dias) {
        return this.actualizar(`/alquileres.php?action=renovar&id=${idAlquiler}`, { dias });
    }

    // ============================================
    // VALIDADORES
    // ============================================

    /**
     * Validar email
     */
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validar contraseña
     */
    static validarContrasena(contrasena) {
        return contrasena && contrasena.length >= 6;
    }

    /**
     * Validar nombre
     */
    static validarNombre(nombre) {
        return nombre && nombre.trim().length >= 2;
    }
}

/**
 * Hacer ClienteAPI disponible globalmente
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClienteAPI;
}
