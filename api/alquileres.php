<?php
// Microservicio de Alquileres

require 'config.php';
global $conn;

session_start();

$action = $_GET['action'] ?? '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'misos') {
            handleGetMisAlquileres($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    case 'POST':
        if ($action === 'crear') {
            handleCrearAlquiler($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    case 'PUT':
        if ($action === 'devolver') {
            handleDevolverLibro($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function handleGetMisAlquileres($conn) {
    $token = getToken();
    if (!$token) {
        echo json_encode(['error' => 'Token requerido']);
        return;
    }

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(['error' => 'No autorizado']);
        return;
    }

    $userId = (int)$userId;
    $query = "SELECT a.id, l.titulo, l.autor, l.genero, l.portada_url, a.fecha_inicio, a.fecha_vencimiento, a.estado
            FROM alquileres a
            JOIN libros l ON a.libro_id = l.id
            WHERE a.usuario_id = $userId AND a.estado = 'activo'
            ORDER BY a.fecha_inicio DESC";

    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta']);
        return;
    }

    $alquileres = [];
    while ($row = $result->fetch_assoc()) {
        $alquileres[] = $row;
    }

    echo json_encode(['success' => true, 'alquileres' => $alquileres]);
}

function handleCrearAlquiler($conn) {
    $token = getToken();
    if (!$token) {
        echo json_encode(['error' => 'Token requerido']);
        return;
    }

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(['error' => 'No autorizado']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $libroId = (int)($data['libro_id'] ?? 0);
    $diasAlquiler = (int)($data['dias_alquiler'] ?? 7);

    if (!$libroId || $diasAlquiler < 1 || $diasAlquiler > 30) {
        echo json_encode(['error' => 'Datos de alquiler inválidos']);
        return;
    }

    $checkQuery = "SELECT id FROM libros WHERE id = $libroId";
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows === 0) {
        echo json_encode(['error' => 'Libro no encontrado']);
        return;
    }

    $userId = (int)$userId;
    $existQuery = "SELECT id FROM alquileres WHERE usuario_id = $userId AND libro_id = $libroId AND estado = 'activo'";
    $existResult = $conn->query($existQuery);

    if ($existResult->num_rows > 0) {
        echo json_encode(['error' => 'Ya tienes este libro alquilado']);
        return;
    }

    $fechaVencimiento = date('Y-m-d', strtotime("+$diasAlquiler days"));

    $query = "INSERT INTO alquileres (usuario_id, libro_id, fecha_inicio, fecha_vencimiento, estado)
            VALUES ($userId, $libroId, NOW(), '$fechaVencimiento', 'activo')";

    if ($conn->query($query)) {
        echo json_encode(['success' => true, 'message' => 'Libro alquilado exitosamente', 'alquiler_id' => $conn->insert_id]);
    } else {
        echo json_encode(['error' => 'Error al crear alquiler']);
    }
}

function handleDevolverLibro($conn) {
    $token = getToken();
    if (!$token) {
        echo json_encode(['error' => 'Token requerido']);
        return;
    }

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(['error' => 'No autorizado']);
        return;
    }

    $alquilerId = (int)($_GET['id'] ?? 0);

    if (!$alquilerId) {
        echo json_encode(['error' => 'ID de alquiler requerido']);
        return;
    }

    $userId = (int)$userId;
    $checkQuery = "SELECT id FROM alquileres WHERE id = $alquilerId AND usuario_id = $userId";
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows === 0) {
        echo json_encode(['error' => 'Alquiler no encontrado']);
        return;
    }

    $query = "UPDATE alquileres SET estado = 'devuelto', fecha_devolucion = NOW() WHERE id = $alquilerId";

    if ($conn->query($query)) {
        echo json_encode(['success' => true, 'message' => 'Libro devuelto exitosamente']);
    } else {
        echo json_encode(['error' => 'Error al devolver libro']);
    }
}

function getToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return $_SESSION['token'] ?? null;
}
?>
