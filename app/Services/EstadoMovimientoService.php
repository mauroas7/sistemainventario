<?php

namespace App\Services;

use App\Models\EstadoMovimiento;

class EstadoMovimientoService
{
    public function obtenerEstadoMovimiento()
    {
        return EstadoMovimiento::orderBy('nombre')->get();
    }
}