<?php

namespace App\Services;

use App\Models\Motivo;

class MotivoService
{
    public function obtenerMotivos()
    {
        return Motivo::orderBy('nombre')->get();
    }
}