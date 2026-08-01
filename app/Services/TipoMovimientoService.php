<?php

namespace App\Services;

use App\Models\TipoMovimiento;

class TipoMovimientoService
{
    public function obtenerTipoMovimiento()
    {
        return TipoMovimiento::orderBy('nombre')->get();
    }
}
