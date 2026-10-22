<?php

/*
 * El idioma de respaldo también es es, así que una regla que falte acá sale
 * como la clave cruda («validation.after_or_equal»). Están las reglas que usa
 * la aplicación, y `tests/Unit/TraduccionesTest.php` avisa si se usa otra.
 */

return [
    'after_or_equal' => 'El campo :attribute tiene que ser una fecha desde :date en adelante.',
    'boolean' => 'El campo :attribute tiene que ser verdadero o falso.',
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'current_password' => 'La :attribute no es correcta.',
    'date' => 'El campo :attribute no es una fecha válida.',
    'different' => 'Los campos :attribute y :other tienen que ser distintos.',
    'email' => 'El campo :attribute tiene que ser una dirección de correo válida.',
    'enum' => 'El valor elegido en :attribute no es válido.',
    'exists' => 'El valor elegido en :attribute no es válido.',
    'file' => 'El campo :attribute tiene que ser un archivo.',
    'integer' => 'El campo :attribute tiene que ser un número entero.',
    'lowercase' => 'El campo :attribute tiene que estar en minúsculas.',
    'mimes' => 'El campo :attribute tiene que ser un archivo de tipo: :values.',
    'max' => [
        'array' => 'El campo :attribute no puede tener más de :max elementos.',
        'file' => 'El campo :attribute no puede pesar más de :max kilobytes.',
        'numeric' => 'El campo :attribute no puede ser mayor que :max.',
        'string' => 'El campo :attribute no puede tener más de :max caracteres.',
    ],
    'min' => [
        'array' => 'El campo :attribute tiene que tener al menos :min elementos.',
        'file' => 'El campo :attribute tiene que pesar al menos :min kilobytes.',
        'numeric' => 'El campo :attribute tiene que ser al menos :min.',
        'string' => 'El campo :attribute tiene que tener al menos :min caracteres.',
    ],
    'required' => 'El campo :attribute es obligatorio.',
    'string' => 'El campo :attribute tiene que ser texto.',
    'unique' => 'Ese :attribute ya está en uso.',

    // Los campos de los `$request->validate()` sueltos, que no tienen un attributes() donde nombrarlos.
    'attributes' => [
        'name' => 'nombre',
        'email' => 'correo',
        'password' => 'contraseña',
        'current_password' => 'contraseña actual',
        'rol' => 'rol',
        'area_id' => 'área',
        'bien_id' => 'bien',
        'area_origen_id' => 'área de origen',
        'area_destino_id' => 'área de destino',
        'tipo_movimiento_id' => 'tipo de movimiento',
        'motivo_id' => 'motivo',
        'estado_movimiento_id' => 'estado',
        'responsable_nuevo_id' => 'responsable',
        'observaciones_salida' => 'observaciones',
        'imagen' => 'foto',
        'desde' => 'desde',
        'hasta' => 'hasta',
        'bien' => 'bien',
    ],
];
