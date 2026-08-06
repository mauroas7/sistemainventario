<?php

namespace App\Services;

use App\Models\Bien;

class BienService
{
    public function obtenerBienes(?int $areaId = null, bool $esAdmin = false)
    {
        // 'responsable' entra acá porque BienResource lo expone: sin precargarlo,
        // Eloquent lo resolvía con una consulta suelta por cada bien del listado.
        $query = Bien::with([
            'area',
            'ubicacionActual',
            'estado',
            'responsable',
        ])->orderBy('id');

        if (! $esAdmin) {
            $query->where('area_id', $areaId);
        }

        return $query->get();
    }
}
