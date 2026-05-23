// auth.js - Lógica de autenticación

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', manejarRegistro);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', manejarLogout);
    }
});

async function manejarLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await api.login(email, password);

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        mostrarExito('¡Sesión iniciada exitosamente!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al iniciar sesión');
    }
}

async function manejarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    try {
        const data = await api.registro(nombre, email, password);

        if (data.error) {
            mostrarError('Error: ' + data.error);
            return;
        }

        mostrarExito('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al registrarse');
    }
}

function manejarLogout() {
    api.logout();
    window.location.href = 'index.html';
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
