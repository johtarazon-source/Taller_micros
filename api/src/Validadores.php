<?php
namespace GestorLibros;

class Validadores {
    public static function validarEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validarContrasena($contrasena) {
        return strlen($contrasena) >= 6;
    }

    public static function validarNombre($nombre) {
        return !empty($nombre) && strlen($nombre) >= 2;
    }

    public static function validarJSON($json) {
        json_decode($json);
        return json_last_error() === JSON_ERROR_NONE;
    }

    public static function sanitizar($entrada) {
        return htmlspecialchars(trim($entrada), ENT_QUOTES, 'UTF-8');
    }
}
?>
