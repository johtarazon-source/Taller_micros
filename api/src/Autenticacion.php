<?php
namespace GestorLibros;

class Autenticacion {
    public static function hashearContrasena($contrasena) {
        return password_hash($contrasena, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function verificarContrasena($contrasena, $hash) {
        return password_verify($contrasena, $hash);
    }

    public static function obtenerToken() {
        $encabezados = getallheaders();
        if (isset($encabezados['Authorization'])) {
            if (preg_match('/Bearer\s(\S+)/', $encabezados['Authorization'], $coincidencias)) {
                return $coincidencias[1];
            }
        }
        return null;
    }

    public static function verificarToken($token) {
        return $token !== null;
    }

    public static function obtenerIdUsuarioActual() {
        $token = self::obtenerToken();
        if (!$token || !self::verificarToken($token)) {
            return null;
        }
        return $_SESSION['id_usuario'] ?? null;
    }

    public static function generarToken($idUsuario) {
        return base64_encode(json_encode([
            'id_usuario' => $idUsuario,
            'timestamp' => time()
        ]));
    }
}
?>
