-- Gestor de Libros - Base de Datos
-- Importar esto en phpMyAdmin

CREATE DATABASE IF NOT EXISTS gestor_libros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestor_libros;

-- Tabla de usuarios
DROP TABLE IF EXISTS alquileres;
DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de libros
CREATE TABLE libros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    anio_publicacion INT,
    genero VARCHAR(50),
    descripcion TEXT,
    portada_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de alquileres
CREATE TABLE alquileres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    fecha_devolucion DATETIME NULL,
    estado ENUM('activo', 'devuelto', 'vencido') DEFAULT 'activo',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_libro (libro_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar libros de ejemplo
INSERT INTO libros (titulo, autor, anio_publicacion, genero, descripcion, portada_url) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967, 'Realismo Mágico', 'La historia de la familia Buendía a través de cien años.', 'https://via.placeholder.com/200x250?text=Cien+anos+de+soledad'),
('Don Quijote', 'Miguel de Cervantes', 1605, 'Novela', 'Las aventuras del ingeniero Quixano convertido en caballero.', 'https://via.placeholder.com/200x250?text=Don+Quijote'),
('El Quijote de la Mancha', 'Miguel de Cervantes', 1605, 'Aventura', 'Clasico de la literatura espanola.', 'https://via.placeholder.com/200x250?text=El+Quijote'),
('La Casa de los Espíritus', 'Isabel Allende', 1982, 'Realismo Mágico', 'Saga familiar que abarca varias generaciones.', 'https://via.placeholder.com/200x250?text=Casa+de+Espiritus'),
('Crimen y Castigo', 'Fiódor Dostoyevski', 1866, 'Psicológica', 'Novela sobre el crimen, el castigo y la redención.', 'https://via.placeholder.com/200x250?text=Crimen+y+Castigo'),
('El Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasía', 'Las aventuras de Bilbo Bolsón en La Tierra Media.', 'https://via.placeholder.com/200x250?text=El+Hobbit'),
('Harry Potter y la Piedra Filosofal', 'J.K. Rowling', 1997, 'Fantasía', 'El primer viaje de Harry Potter a Hogwarts.', 'https://via.placeholder.com/200x250?text=Harry+Potter'),
('El Código Da Vinci', 'Dan Brown', 2003, 'Misterio', 'Un thriller de misterio religioso e historico.', 'https://via.placeholder.com/200x250?text=El+Codigo+Da+Vinci'),
('Orgullo y Prejuicio', 'Jane Austen', 1813, 'Romance', 'Historia de romance y sociedad en la Inglaterra del siglo XIX.', 'https://via.placeholder.com/200x250?text=Orgullo+y+Prejuicio'),
('1984', 'George Orwell', 1949, 'Distopía', 'Novela distopica sobre un futuro totalitario.', 'https://via.placeholder.com/200x250?text=1984'),
('Fahrenheit 451', 'Ray Bradbury', 1953, 'Ciencia Ficción', 'Un mundo donde se queman los libros.', 'https://via.placeholder.com/200x250?text=Fahrenheit+451'),
('El Señor de los Anillos', 'J.R.R. Tolkien', 1954, 'Fantasía', 'La epopoya definitiva de la fantasia.', 'https://via.placeholder.com/200x250?text=El+Senor+de+los+Anillos');
