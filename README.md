# 📚 BookHub - Plataforma de Alquiler de Libros

Una plataforma moderna y elegante para alquilar libros, desarrollada con HTML5, CSS3, PHP, MySQL y JavaScript.

## 🌸 Características Principales

### ✨ Interfaz Moderna y Floral
- **Diseño responsivo** - Funciona perfectamente en desktop y mobile
- **Formularios interactivos** - Login y registro con animaciones suaves
- **Glassmorphism** - Efectos de cristal semi-transparente
- **Decoraciones florales** - Flores animadas flotando en el fondo
- **Gradientes dinámicos** - Colores rosa-magenta con transiciones suaves

### 📖 Características de Negocio
- **Catálogo de libros** - Accede a miles de títulos con imágenes reales
- **Sistema de alquileres** - Alquila libros por 1-30 días
- **Mi Biblioteca** - Gestiona tus alquileres activos
- **Búsqueda por géneros** - Filtra libros por categoría
- **Autenticación segura** - Sistema de login y registro validado

### 🧪 Testing Automatizado
- **PHPUnit** - Suite completa de tests para endpoints API
- **Composer** - Gestión de dependencias PHP
- **Validación de endpoints** - Tests para usuarios, libros y alquileres
- **Reportes de cobertura** - Análisis de cobertura de código

## 📂 Estructura del Proyecto

```
Taller_micros/
├── api/                          # Endpoints REST de la API
│   ├── config.php               # Configuración base de datos
│   ├── usuarios.php             # Endpoints de autenticación
│   ├── libros.php               # Endpoints de catálogo
│   └── alquileres.php           # Endpoints de alquileres
├── js/                          # Código JavaScript
│   ├── api-client.js            # Cliente HTTP para la API
│   ├── auth.js                  # Lógica de autenticación
│   └── biblioteca.js            # Lógica de mi biblioteca
├── tests/                       # Suite de tests PHPUnit
│   ├── bootstrap.php            # Configuración inicial
│   ├── ApiTestCase.php          # Clase base para tests
│   ├── LibrosApiTest.php        # Tests de libros
│   ├── UsuariosApiTest.php      # Tests de usuarios
│   └── AlquileresApiTest.php    # Tests de alquileres
├── login.html                   # Página de inicio de sesión
├── registro.html                # Página de registro
├── index.html                   # Página principal
├── biblioteca.html              # Mi biblioteca (protegida)
├── libros.html                  # Catálogo de libros
├── generos.html                 # Búsqueda por géneros
├── estilos.css                  # Estilos globales
├── composer.json                # Configuración de Composer
├── phpunit.xml                  # Configuración de PHPUnit
├── TESTING.md                   # Documentación de tests
└── README.md                    # Este archivo
```

## 🎨 Diseño Frontend

### Página de Login
- Fondo con gradiente rosa-magenta (#f093fb → #f5576c)
- Flores decorativas (🌸🌺🌼🌻🌹) animadas
- Formulario modal con glassmorphism
- Inputs con placeholders descriptivos
- Botón interactivo con efecto shine
- Enlace a registro con animación hover

### Página de Registro
- Mismo diseño que login
- 4 campos: nombre, email, contraseña, confirmar
- Modal scrollable para mobile
- Validación HTML5

### Mi Biblioteca
- Encabezado elegante con botón de cerrar sesión
- Grid responsivo de tarjetas de libros
- Cada tarjeta muestra: portada, título, autor, género, fecha de devolución
- Indicador visual (✓ o ⚠️) de vencimiento
- Botón "Devolver" con confirmación

## 🔌 API Endpoints

### Usuarios
```
POST   /api/usuarios.php?action=registro    # Registrar usuario
POST   /api/usuarios.php?action=login       # Iniciar sesión
GET    /api/usuarios.php?action=obtener     # Obtener datos (protegido)
```

### Libros
```
GET    /api/libros.php                      # Listar libros
GET    /api/libros.php?action=generos       # Obtener géneros
GET    /api/libros.php?action=obtener&id=X  # Obtener libro por ID
GET    /api/libros.php?action=porGenero&genero=X  # Libros por género
POST   /api/libros.php?action=crear         # Crear libro (protegido)
```

### Alquileres
```
GET    /api/alquileres.php?action=misos     # Mis alquileres (protegido)
POST   /api/alquileres.php?action=crear     # Crear alquiler (protegido)
PUT    /api/alquileres.php?action=devolver&id=X  # Devolver libro (protegido)
```

## 🧪 Testing

### Instalar dependencias
```bash
composer install
```

### Ejecutar tests
```bash
php vendor/bin/phpunit
```

### Tests disponibles
- **LibrosApiTest** - 6 tests para endpoints de libros
- **UsuariosApiTest** - 8 tests para autenticación
- **AlquileresApiTest** - 7 tests para alquileres

### Ejemplos de tests
```php
// Obtener lista de libros
testGetLibrosList()

// Validar estructura de datos
testLibroStructure()

// Registrar usuario
testRegistroValido()

// Login con credenciales
testLoginValido()

// Crear alquiler
testCrearAlquilerInvalidData()
```

## 🎯 Flujo de Uso

### Para nuevos usuarios
1. Ir a `registro.html`
2. Completar formulario con datos
3. Sistema valida y crea cuenta
4. Automáticamente redirige a login

### Para usuarios registrados
1. Ir a `login.html`
2. Ingresar email y contraseña
3. Sistema genera token JWT
4. Token se guarda en localStorage
5. Acceso a funciones protegidas

### Para alquilar libros
1. Navegar a catálogo (`libros.html`)
2. Ver libros disponibles
3. Hacer clic en "Alquilar"
4. Si no está autenticado → redirige a login
5. Seleccionar duración (1-30 días)
6. Libro aparece en "Mi Biblioteca"

### Para devolver libros
1. Ir a "Mi Biblioteca" (`biblioteca.html`)
2. Ver lista de alquileres activos
3. Hacer clic en "Devolver"
4. Confirmar devolución
5. Libro desaparece de la lista

## 🔐 Seguridad

- **Tokens JWT** - Autenticación stateless
- **Hash bcrypt** - Contraseñas hasheadas
- **SQL Injection** - Prepared statements
- **CORS** - Validación de origen
- **Rate limiting** - Protección contra abuso
- **HTTPS recomendado** - Para producción

## 🚀 Despliegue

### Requisitos
- PHP 8.2+
- MySQL 5.7+
- Apache con mod_rewrite
- Composer

### Pasos
1. Clonar repositorio
2. `composer install`
3. Crear base de datos
4. Configurar `api/config.php`
5. Crear tablas (ver `database/schema.sql`)
6. Servir con Apache/PHP

## 📚 Datos de Ejemplo

Base de datos incluye:
- 12 libros clásicos con portadas reales
- Múltiples géneros (Ficción, Misterio, Fantasía, etc.)
- Imágenes de portadas desde Open Library API

## 🎨 Colores y Estilo

### Paleta Principal
- Gradiente login/registro: #f093fb → #f5576c (rosa-magenta)
- Gradiente Mi Biblioteca: #667eea → #764ba2 (púrpura)
- Púrpura oscuro: #6b21a8
- Magenta: #d946ef
- Rosa: #ec4899

### Tipografía
- Font primaria: System UI, -apple-system, Segoe UI, Roboto
- Pesos: 400 (normal), 600 (semibold), 700 (bold)
- Tamaños responsive con `clamp()`

### Efectos
- Blur backdrop: 30px
- Border radius: 1.2-2.5rem
- Transiciones: cubic-bezier(0.34, 1.56, 0.64, 1)
- Sombras: 0 30px 80px rgba(0,0,0,0.15)

## 📱 Responsividad

- **Desktop** - Layouts completos, max-width: 1200px
- **Tablet** - Ajustes de padding y font-size
- **Mobile** - Stacking vertical, full-width modals

## 🔧 Configuración

### Base de datos
Actualizar en `api/config.php`:
```php
$host = 'localhost';
$db = 'bookhub';
$user = 'root';
$password = '';
```

### Composer
Scripts disponibles en `composer.json`:
```bash
composer test           # Ejecutar tests
composer dump-autoload  # Regenerar autoloader
```

## 📊 Estadísticas

- ✅ 100% responsive design
- ✅ 21 tests automatizados
- ✅ 7 endpoints API
- ✅ 3 páginas protegidas
- ✅ 0 footers de derechos reservados
- ✅ Animaciones suaves

## 🐛 Troubleshooting

### Los tests fallan
```bash
php vendor/bin/phpunit --verbose
# Verificar que Apache esté corriendo
# Verificar BASE_URL en tests/bootstrap.php
```

### API retorna error 500
```bash
# Verificar logs de PHP: /var/log/php/
# Verificar permisos de carpeta: chmod 755
# Verificar conexión a base de datos
```

### Formularios no envían
```bash
# Verificar que api-client.js está cargado
# Verificar console.log para errores
# Verificar CORS headers en api/
```

## 📄 Licencia

BookHub © 2025 - Todos los derechos reservados.

## 👨‍💻 Desarrollado con

- HTML5
- CSS3 (Glassmorphism, Gradients, Animations)
- JavaScript (Vanilla)
- PHP 8.2
- MySQL
- PHPUnit
- Composer

---

**Última actualización:** Mayo 2026
**Versión:** 2.0 - Interfaz Floral Moderna
