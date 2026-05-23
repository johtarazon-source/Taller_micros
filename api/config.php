<?php
// Configuración global de la API

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'gestor_libros');

// Conexión a la base de datos
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

$conn->set_charset("utf8");

// Clase para respuestas
class APIResponse {
    public static function success($data = null, $message = 'Success') {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function error($message, $code = 400) {
        http_response_code($code);
        return ['error' => $message];
    }
}

// Función para obtener el token JWT
function getToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

// Función para verificar token (simplificada)
function verifyToken($token) {
    // Implementación simplificada - en producción usar JWT real
    return $token !== null;
}

// Función para obtener usuario actual
function getCurrentUserId() {
    $token = getToken();
    if (!$token || !verifyToken($token)) {
        return null;
    }
    // En una implementación real, decodificar el JWT para obtener el ID
    return $_SESSION['user_id'] ?? null;
}
?>
