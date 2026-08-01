<?php

namespace App\Services;

use App\Models\Bien;

class BienService
{
    public function obtenerBienes()
    {
        return Bien::with([
            'area',
            'ubicacionActual',
            'estado'
        ])->orderBy('id')->get();
    }
}
