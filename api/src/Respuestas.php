<?php
namespace GestorLibros;

class Respuestas {
    public static function exito($datos = null, $mensaje = 'Éxito') {
        http_response_code(200);
        return [
            'exito' => true,
            'mensaje' => $mensaje,
            'datos' => $datos
        ];
    }

    public static function error($mensaje, $codigo = 400) {
        http_response_code($codigo);
        return [
            'exito' => false,
            'error' => $mensaje,
            'codigo' => $codigo
        ];
    }

    public static function created($datos, $mensaje = 'Creado exitosamente') {
        http_response_code(201);
        return [
            'exito' => true,
            'mensaje' => $mensaje,
            'datos' => $datos
        ];
    }

    public static function noEncontrado($mensaje = 'Recurso no encontrado') {
        http_response_code(404);
        return [
            'exito' => false,
            'error' => $mensaje,
            'codigo' => 404
        ];
    }

    public static function noAutorizado($mensaje = 'No autorizado') {
        http_response_code(401);
        return [
            'exito' => false,
            'error' => $mensaje,
            'codigo' => 401
        ];
    }
}
?>
