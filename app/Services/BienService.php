<?php

namespace App\Services;

use App\Models\Bien;

class BienService
{
    public function obtenerBienes(?int $areaId = null, bool $esAdmin = false)
    {
        $query = Bien::with([
            'area',
            'ubicacionActual',
            'estado'
        ])->orderBy('id');

        if (! $esAdmin) {
            $query->where('area_id', $areaId);
        }

        return $query->get();
    }
}
