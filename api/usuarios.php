<?php
// Microservicio de Usuarios

require 'config.php';
global $conn;

session_start();

$action = $_GET['action'] ?? '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        if ($action === 'login') {
            handleLogin($conn);
        } elseif ($action === 'registro') {
            handleRegistro($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    case 'GET':
        if ($action === 'perfil') {
            handleGetPerfil($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function handleLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['error' => 'Email y contraseña requeridos']);
        return;
    }

    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    $query = "SELECT id, nombre, email, contrasena FROM usuarios WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'Usuario no encontrado']);
        return;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['contrasena'])) {
        echo json_encode(['error' => 'Contraseña incorrecta']);
        return;
    }

    $token = bin2hex(random_bytes(32));

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['nombre'];
    $_SESSION['token'] = $token;

    echo json_encode([
        'success' => true,
        'message' => 'Sesión iniciada exitosamente',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email']
        ]
    ]);
}

function handleRegistro($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['nombre']) || !isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['error' => 'Nombre, email y contraseña requeridos']);
        return;
    }

    $nombre = $conn->real_escape_string($data['nombre']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    $checkQuery = "SELECT id FROM usuarios WHERE email = '$email'";
    $checkResult = $conn->query($checkQuery);

    if ($checkResult->num_rows > 0) {
        echo json_encode(['error' => 'El email ya está registrado']);
        return;
    }

    $query = "INSERT INTO usuarios (nombre, email, contrasena, fecha_registro) VALUES ('$nombre', '$email', '$password', NOW())";

    if ($conn->query($query)) {
        $userId = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => [
                'id' => $userId,
                'nombre' => $nombre,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Error al registrar usuario']);
    }
}

function handleGetPerfil($conn) {
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
    $query = "SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = $userId";
    $result = $conn->query($query);

    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'Usuario no encontrado']);
        return;
    }

    $user = $result->fetch_assoc();
    echo json_encode(['success' => true, 'user' => $user]);
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
