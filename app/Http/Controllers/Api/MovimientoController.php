<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\MovimientoResource;
use App\Services\MovimientoService;
use App\Models\Movimiento;

class MovimientoController extends Controller
{
    public function __construct(
        private MovimientoService $movimientoService
    ) {}

    // Obtiene todos los movimientos
    public function index()
    {
        return MovimientoResource::collection(
            $this->movimientoService->obtenerTodos()
        );
    }

    // Busca por id - Laravel lo hace automáticamente gracias al Route Model Binding
    public function show(Movimiento $movimiento)
    {
        return new MovimientoResource($movimiento);
    }

    // POST - Crear movimiento
    public function store(Request $request)
    {
        $datos = $request->only([
            'bien_id',
            'creado_por',
            'recibido_por',
            'area_origen_id',
            'area_destino_id',
            'tipo_movimiento_id',
            'motivo_id',
            'estado_movimiento_id',
            'condicion_al_salir',
            'condicion_al_recibir',
            'observaciones_salida',
            'observaciones_recepcion',
            'fecha_movimiento',
            'fecha_recepcion',
        ]);

        $movimiento = $this->movimientoService->crear($datos);

        return new MovimientoResource($movimiento);
    }

    public function update(Request $request, Movimiento $movimiento)
    {
        $datos = $request->only([
            'bien_id',
            'creado_por',
            'recibido_por',
            'area_origen_id',
            'area_destino_id',
            'tipo_movimiento_id',
            'motivo_id',
            'estado_movimiento_id',
            'condicion_al_salir',
            'condicion_al_recibir',
            'observaciones_salida',
            'observaciones_recepcion',
            'fecha_movimiento',
            'fecha_recepcion',
        ]);

        $movimiento = $this->movimientoService->actualizar($movimiento, $datos);

        return new MovimientoResource($movimiento);
    }
}
