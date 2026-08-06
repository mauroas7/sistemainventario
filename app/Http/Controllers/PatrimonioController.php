<?php

namespace App\Http\Controllers;

use App\Http\Resources\BienResource;
use App\Http\Resources\MovimientoResource;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;
use App\Models\Movimiento;
use App\Models\User;
use App\Services\BienService;
use App\Services\MovimientoService;
use Inertia\Inertia;
use Inertia\Response;

class PatrimonioController extends Controller
{
    public function __construct(
        private BienService $bienService,
        private MovimientoService $movimientoService,
    ) {}

    public function dashboard(): Response
    {
        $movimientos = $this->movimientoService->obtenerTodos();

        return Inertia::render('Patrimonio/Dashboard', [
            'kpis' => [
                'total' => $movimientos->count(),
                'pendientes' => $movimientos->where('estadoMovimiento.nombre', 'Pendiente')->count(),
                'recibidos' => $movimientos->where('estadoMovimiento.nombre', 'Recibido')->count(),
            ],
            'ultimosTickets' => MovimientoResource::collection($movimientos->take(10)),
        ]);
    }

    public function bienesIndex(): Response
    {
        return Inertia::render('Patrimonio/Bienes/Index', [
            'bienes' => BienResource::collection($this->bienService->obtenerBienes()),
        ]);
    }

    public function bienesShow(Bien $bien): Response
    {
        $bien->load(['area', 'ubicacionActual', 'estado']);

        $movimientos = $bien->movimientos()
            ->with([
                'bien',
                'creador',
                'receptor',
                'areaOrigen',
                'areaDestino',
                'tipoMovimiento',
                'motivo',
                'estadoMovimiento',
            ])
            ->orderByDesc('fecha_movimiento')
            ->get();

        return Inertia::render('Patrimonio/Bienes/Show', [
            'bien' => new BienResource($bien),
            'movimientos' => MovimientoResource::collection($movimientos),
        ]);
    }

    public function ticketsShow(Movimiento $movimiento): Response
    {
        $movimiento->load([
            'bien',
            'creador',
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ]);

        return Inertia::render('Patrimonio/Tickets/Show', [
            'movimiento' => new MovimientoResource($movimiento),
        ]);
    }

    public function configuracionIndex(): Response
    {
        return Inertia::render('Patrimonio/Configuracion/Index', [
            'totalAreas' => Area::count(),
            'totalUsuarios' => User::count(),
            'totalEstadosBien' => EstadoBien::count(),
        ]);
    }
}
