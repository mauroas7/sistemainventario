<?php

namespace App\Http\Controllers;

use App\Models\Bien;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function create(): Response
    {
        $bienes = Bien::query()
            ->where('disponible', true)
            ->orderBy('codigo_patrimonial')
            ->get([
                'id',
                'codigo_patrimonial',
                'nombre',
                'marca',
                'modelo',
                'ubicacion',
            ]);

        return Inertia::render('Envio/Create', [
            'bienes' => $bienes,
        ]);
    }

    public function inbox(): Response
    {
        return Inertia::render('Recepcion/Index');
    }
}
