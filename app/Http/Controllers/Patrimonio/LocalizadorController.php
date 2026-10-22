<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Resources\BienResource;
use App\Http\Resources\MovimientoResource;
use App\Models\Bien;
use App\Models\Movimiento;
use App\Services\MovimientoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** Dónde está cada bien y cuál fue su último movimiento. La búsqueda la hace la pantalla. */
class LocalizadorController extends Controller
{
    public function index(Request $request): Response
    {
        $ultimos = Movimiento::with(MovimientoService::RELACIONES)
            ->orderByDesc('fecha_movimiento')
            ->orderByDesc('id')
            ->get()
            ->unique('bien_id');

        return Inertia::render('Patrimonio/Localizador/Index', [
            'bienes' => BienResource::collection(Bien::with(BienResource::RELACIONES)->orderBy('codigo')->get())->resolve($request),
            'ultimosMovimientos' => $ultimos
                ->mapWithKeys(fn (Movimiento $movimiento) => [
                    $movimiento->bien_id => (new MovimientoResource($movimiento))->resolve($request),
                ]),
        ]);
    }
}
