<?php

namespace App\Http\Controllers;

use App\Http\Resources\AreaResource;
use App\Http\Resources\BienResource;
use App\Http\Resources\MotivoResource;
use App\Http\Resources\MovimientoResource;
use App\Http\Resources\TipoMovimientoResource;
use App\Models\Bien;
use App\Models\EstadoMovimiento;
use App\Models\Movimiento;
use App\Services\AreaService;
use App\Services\MotivoService;
use App\Services\TipoMovimientoService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function __construct(
        private AreaService $areaService,
        private TipoMovimientoService $tipoMovimientoService,
        private MotivoService $motivoService,
    ) {}

    public function create(): Response
    {
        $usuario = Auth::user();

        $bienes = Bien::with(['area', 'ubicacionActual', 'estado'])
            ->where('ubicacion_actual_id', $usuario->area_id)
            ->whereDoesntHave('movimientos', function ($query) {
                $query->whereHas('estadoMovimiento', function ($query) {
                    $query->where('nombre', 'Pendiente');
                });
            })
            ->orderBy('codigo')
            ->get();

        return Inertia::render('Envio/Create', [
            'bienes' => BienResource::collection($bienes),
            'areas' => AreaResource::collection($this->areaService->obtenerTodas()),
            'tiposMovimiento' => TipoMovimientoResource::collection($this->tipoMovimientoService->obtenerTipoMovimiento()),
            'motivos' => MotivoResource::collection($this->motivoService->obtenerMotivos()),
        ]);
    }

    public function inbox(): Response
    {
        $usuario = Auth::user();

        $movimientos = Movimiento::with([
            'bien',
            'creador',
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ])
            ->where('area_destino_id', $usuario->area_id)
            ->orderByDesc('fecha_movimiento')
            ->get();

        return Inertia::render('Recepcion/Index', [
            'movimientos' => MovimientoResource::collection($movimientos),
            'estadoRecibidoId' => EstadoMovimiento::where('nombre', 'Recibido')->value('id'),
        ]);
    }
}
