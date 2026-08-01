<?php

namespace App\Services;

use App\Models\EstadoBien;

class EstadoBienService
{
    public function obtenerEstadoBien()
    {
        return EstadoBien::orderBy('nombre')->get();
    }
}