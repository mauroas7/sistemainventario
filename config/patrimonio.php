<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Destinatarios de los avisos de movimiento
    |--------------------------------------------------------------------------
    |
    | Casillas de Gestión de Bienes e Insumos que reciben el aviso cada vez que
    | un responsable informa el movimiento de un bien. Se aceptan varias
    | separadas por coma. Si queda vacío, el sistema avisa a todos los usuarios
    | con rol admin para no dejar el circuito sin destinatario.
    |
    */

    'notificaciones_email' => env('PATRIMONIO_NOTIFICACIONES_EMAIL', ''),

];
