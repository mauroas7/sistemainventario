<?php

namespace App\Services;

use App\Models\Movimiento;

class MovimientoService
{
    // Obtener todos los movimientos.
    public function obtenerTodos()
    {
        return Movimiento::with([               // Este with se podría poner en un solo método y que tanto obtenerTodos()
            'bien',                             // y obtenerPorId() lo reutilicen. También, sería útil para nuevos métodos
            'creador',                          // que tengan que hacer lo mismo.
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ])
            ->orderByDesc('fecha_movimiento')
            ->get();
    }

    // Crear un movimiento.
    public function crear(array $datos)
    {
        return Movimiento::create($datos);
    }

    // Actualizar un movimiento.
    public function actualizar(Movimiento $movimiento, array $datos)
    {
        $movimiento->update($datos);

        return $movimiento->fresh([
            'bien',
            'creador',
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ]);
    }
}
