<?php
// Microservicio de Libros

require 'config.php';
global $conn;

session_start();

$action = $_GET['action'] ?? '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'lista' || $action === '') {
            handleGetLibros($conn);
        } elseif ($action === 'generos') {
            handleGetGeneros($conn);
        } elseif ($action === 'porGenero') {
            handleGetLibrosPorGenero($conn);
        } elseif ($action === 'obtener') {
            handleGetLibroPorId($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    case 'POST':
        if ($action === 'crear') {
            handleCrearLibro($conn);
        } else {
            echo json_encode(['error' => 'Acción no válida']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function handleGetLibros($conn) {
    $destacados = isset($_GET['destacados']) ? $_GET['destacados'] === 'true' : false;
    $limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 50;

    $query = "SELECT id, titulo, autor, anio_publicacion, genero, portada_url, descripcion FROM libros";

    if ($destacados) {
        $query .= " ORDER BY RAND()";
    } else {
        $query .= " ORDER BY titulo ASC";
    }

    $query .= " LIMIT $limite";

    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta']);
        return;
    }

    $libros = [];
    while ($row = $result->fetch_assoc()) {
        $libros[] = $row;
    }

    echo json_encode(['success' => true, 'libros' => $libros]);
}

function handleGetLibroPorId($conn) {
    $id = (int)($_GET['id'] ?? 0);

    if (!$id) {
        echo json_encode(['error' => 'ID requerido']);
        return;
    }

    $query = "SELECT id, titulo, autor, anio_publicacion, genero, portada_url, descripcion FROM libros WHERE id = $id";
    $result = $conn->query($query);

    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'Libro no encontrado']);
        return;
    }

    $libro = $result->fetch_assoc();
    echo json_encode(['success' => true, 'libro' => $libro]);
}

function handleGetGeneros($conn) {
    $query = "SELECT DISTINCT genero FROM libros WHERE genero IS NOT NULL AND genero != '' ORDER BY genero ASC";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta']);
        return;
    }

    $generos = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['genero']) {
            $generos[] = $row['genero'];
        }
    }

    echo json_encode(['success' => true, 'generos' => $generos]);
}

function handleGetLibrosPorGenero($conn) {
    $genero = $conn->real_escape_string($_GET['genero'] ?? '');

    if (!$genero) {
        echo json_encode(['error' => 'Género requerido']);
        return;
    }

    $query = "SELECT id, titulo, autor, anio_publicacion, genero, portada_url, descripcion FROM libros WHERE genero = '$genero' ORDER BY titulo ASC";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta']);
        return;
    }

    $libros = [];
    while ($row = $result->fetch_assoc()) {
        $libros[] = $row;
    }

    echo json_encode(['success' => true, 'libros' => $libros]);
}

function handleCrearLibro($conn) {
    $token = getToken();
    if (!$token) {
        echo json_encode(['error' => 'Token requerido']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $titulo = $conn->real_escape_string($data['titulo'] ?? '');
    $autor = $conn->real_escape_string($data['autor'] ?? '');
    $anio = (int)($data['anio_publicacion'] ?? 0);
    $genero = $conn->real_escape_string($data['genero'] ?? '');
    $descripcion = $conn->real_escape_string($data['descripcion'] ?? '');
    $portada = $conn->real_escape_string($data['portada_url'] ?? '');

    if (!$titulo || !$autor) {
        echo json_encode(['error' => 'Título y autor requeridos']);
        return;
    }

    $query = "INSERT INTO libros (titulo, autor, anio_publicacion, genero, descripcion, portada_url)
              VALUES ('$titulo', '$autor', $anio, '$genero', '$descripcion', '$portada')";

    if ($conn->query($query)) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Libro creado exitosamente']);
    } else {
        echo json_encode(['error' => 'Error al crear libro']);
    }
}
?>
