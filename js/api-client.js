// API Client - Gestiona todas las comunicaciones con los microservicios

class APIClient {
    constructor() {
        // Detectar la ruta base correctamente
        const pathArray = window.location.pathname.split('/');
        const baseIndex = pathArray.indexOf('taller_micros');
        const basePath = baseIndex !== -1
            ? '/' + pathArray.slice(baseIndex, baseIndex + 2).join('/') + '/api'
            : '/taller_micros/Taller_micros/api';

        this.baseURL = window.location.origin + basePath;
        this.token = this.getToken();
        console.log('API Base URL:', this.baseURL);
    }

    // Métodos de autenticación
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/usuarios.php?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                this.setToken(data.token);
            }
            return data;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }

    async registro(nombre, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/usuarios.php?action=registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al registrarse:', error);
            throw error;
        }
    }

    // Métodos de libros
    async obtenerLibros(filtros = {}) {
        try {
            const params = new URLSearchParams({ action: 'lista', ...filtros });
            const response = await fetch(`${this.baseURL}/libros.php?${params}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener libros:', error);
            throw error;
        }
    }

    async obtenerLibroPorId(id) {
        try {
            const response = await fetch(`${this.baseURL}/libros.php?action=obtener&id=${id}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener libro:', error);
            throw error;
        }
    }

    async obtenerGeneros() {
        try {
            const response = await fetch(`${this.baseURL}/libros.php?action=generos`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener géneros:', error);
            throw error;
        }
    }

    async obtenerLibrosPorGenero(genero) {
        try {
            const response = await fetch(`${this.baseURL}/libros.php?action=porGenero&genero=${encodeURIComponent(genero)}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener libros por género:', error);
            throw error;
        }
    }

    // Métodos de alquileres
    async alquilarLibro(libroId, diasAlquiler) {
        try {
            const response = await fetch(`${this.baseURL}/alquileres.php?action=crear`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ libro_id: libroId, dias_alquiler: diasAlquiler })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al alquilar libro:', error);
            throw error;
        }
    }

    async obtenerMisAlquileres() {
        try {
            const response = await fetch(`${this.baseURL}/alquileres.php?action=misos`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener alquileres:', error);
            throw error;
        }
    }

    async devolverLibro(alquilerId) {
        try {
            const response = await fetch(`${this.baseURL}/alquileres.php?action=devolver&id=${alquilerId}`, {
                method: 'PUT',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error al devolver libro:', error);
            throw error;
        }
    }

    // Métodos de utilidad
    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    isAuthenticated() {
        return !!this.token;
    }
}

// Instancia global
const api = new APIClient();
