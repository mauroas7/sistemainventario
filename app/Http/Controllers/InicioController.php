<?php

namespace App\Http\Controllers;

use App\Enums\Rol;
use App\Http\Resources\MovimientoResource;
use App\Models\Movimiento;
use App\Services\MovimientoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InicioController extends Controller
{
    public function __construct(private MovimientoService $movimientoService) {}

    /** Los accesos y, para quien no es de Patrimonio, lo que tiene para acusar y sus últimos tickets. */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->tieneRol(Rol::Admin)) {
            return Inertia::render('Inicio/Index');
        }

        $recurso = fn (Movimiento $m) => (new MovimientoResource($m))->resolve($request);

        return Inertia::render('Inicio/Index', [
            'porAcusar' => $this->movimientoService->obtenerParaBandeja($user, ['por_acusar' => true], 5)->through($recurso),
            'ultimos' => $this->movimientoService->obtenerParaBandeja($user, [], 5)->through($recurso),
        ]);
    }
}
