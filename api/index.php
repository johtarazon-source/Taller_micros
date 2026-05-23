<?php
// API Gateway - Enrutador principal

require 'config.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Obtener el servicio solicitado (ej: /api/usuarios -> 'usuarios')
$service = $segments[2] ?? '';

switch ($service) {
    case 'usuarios':
        $_SERVER['PATH_INFO'] = '/' . implode('/', array_slice($segments, 3));
        require 'usuarios.php';
        break;

    case 'libros':
        $_SERVER['PATH_INFO'] = '/' . implode('/', array_slice($segments, 3));
        require 'libros.php';
        break;

    case 'alquileres':
        $_SERVER['PATH_INFO'] = '/' . implode('/', array_slice($segments, 3));
        require 'alquileres.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Servicio no encontrado']);
}
?>
