<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Resources\BienResource;
use App\Http\Resources\MovimientoResource;
use App\Models\Bien;
use App\Services\MovimientoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** El directorio de bienes del hospital y la ficha de cada uno. */
class BienController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Patrimonio/Bienes/Index', [
            'bienes' => BienResource::collection(Bien::with(BienResource::RELACIONES)->orderBy('id')->get())->resolve($request),
        ]);
    }

    public function show(Request $request, Bien $bien): Response
    {
        $movimientos = $bien->movimientos()
            ->with(MovimientoService::RELACIONES)
            ->orderByDesc('fecha_movimiento')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Patrimonio/Bienes/Show', [
            'bien' => (new BienResource($bien->load(BienResource::RELACIONES)))->resolve($request),
            'movimientos' => MovimientoResource::collection($movimientos)->resolve($request),
        ]);
    }
}
