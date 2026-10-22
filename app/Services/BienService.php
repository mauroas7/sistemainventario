<?php

namespace App\Services;

use App\Models\Bien;

class BienService
{
    public function obtenerBienes(?int $areaId = null, bool $esAdmin = false)
    {
        // Sin precargar 'responsable', que expone BienResource, hay una consulta por bien.
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
