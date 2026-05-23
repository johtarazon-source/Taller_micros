<?php
// Test de conexión a la API
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'config.php';
global $conn;

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión: ' . $conn->connect_error,
        'db_host' => DB_HOST,
        'db_name' => DB_NAME
    ]);
    exit;
}

// Verificar que la tabla de libros existe y tiene datos
$query = "SELECT COUNT(*) as total FROM libros";
$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        'success' => false,
        'error' => 'Error en la consulta: ' . $conn->error
    ]);
    exit;
}

$row = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'message' => 'Conexión exitosa',
    'database' => DB_NAME,
    'total_libros' => $row['total'],
    'api_version' => '2.0'
]);
?>
