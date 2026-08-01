<?php

namespace App\Services;

use App\Models\Area;

class AreaService
{
    public function obtenerTodas()
    {
        return Area::orderBy('nombre')->get();
    }
}
