<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\MovimientoResource;
use App\Services\MovimientoService;
use App\Models\Movimiento;
use App\Models\EstadoMovimiento;

class MovimientoController extends Controller
{
    public function __construct(
        private MovimientoService $movimientoService
    ) {}

    // Obtiene los movimientos visibles para el usuario (scoping por área, admin ve todos).
    // Acepta filtros por query string y pagina el resultado; el scoping por área se
    // aplica igual. Incluye "resumen" con los totales por estado sobre todo lo que
    // matchea el filtro (no solo la página actual).
    public function index(Request $request)
    {
        $user = $request->user();

        $validado = $request->validate([
            'area_id' => ['nullable', 'exists:areas,id'],
            'estado_movimiento_id' => ['nullable', 'exists:estados_movimiento,id'],
            'tipo_movimiento_id' => ['nullable', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['nullable', 'exists:motivos,id'],
            'desde' => ['nullable', 'date'],
            'hasta' => ['nullable', 'date', 'after_or_equal:desde'],
            'bien' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ], [
            'hasta.after_or_equal' => 'La fecha "Hasta" no puede ser anterior a "Desde".',
            'desde.date' => 'La fecha "Desde" no es válida.',
            'hasta.date' => 'La fecha "Hasta" no es válida.',
            'area_id.exists' => 'El sector seleccionado no existe.',
            'estado_movimiento_id.exists' => 'El estado seleccionado no existe.',
            'motivo_id.exists' => 'El motivo seleccionado no existe.',
        ]);

        $porPagina = $validado['per_page'] ?? 20;
        $filtros = collect($validado)->except(['per_page', 'page'])->all();
        $esAdmin = $user?->rol === 'admin';

        $paginador = $this->movimientoService->obtenerParaBandeja(
            $user?->area_id,
            $esAdmin,
            $filtros,
            $porPagina
        );

        $resumen = $this->movimientoService->obtenerResumen($user?->area_id, $esAdmin, $filtros);

        return MovimientoResource::collection($paginador)->additional(['resumen' => $resumen]);
    }

    // Busca por id - Laravel lo hace automáticamente gracias al Route Model Binding
    public function show(Request $request, Movimiento $movimiento)
    {
        $user = $request->user();
        abort_unless($user, 403);

        $puedeVer = $user->rol === 'admin'
            || (int) $user->area_id === (int) $movimiento->area_origen_id
            || (int) $user->area_id === (int) $movimiento->area_destino_id;

        abort_unless($puedeVer, 403);

        // El binding de ruta entrega el modelo pelado: sin este load, cada campo que
        // arma MovimientoResource dispara su propia consulta. El historial de estados
        // se incluye porque esta es una vista de detalle (en los listados no viaja).
        $movimiento->load(array_merge(MovimientoService::RELACIONES, [
            'historialEstados.estadoAnterior',
            'historialEstados.estadoNuevo',
            'historialEstados.usuario',
        ]));

        return new MovimientoResource($movimiento);
    }

    // POST - Crear movimiento (uso administrativo; el alta normal de tickets va por TicketController::store)
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'bien_id' => ['required', 'exists:bienes,id'],
            'area_origen_id' => ['required', 'exists:areas,id'],
            'area_destino_id' => ['required', 'exists:areas,id', 'different:area_origen_id'],
            'tipo_movimiento_id' => ['required', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['required', 'exists:motivos,id'],
            'responsable_nuevo_id' => ['nullable', 'exists:users,id'],
            'observaciones_salida' => ['nullable', 'string'],
            'fecha_movimiento' => ['nullable', 'date'],
        ]);

        $datos = $validated;
        $datos['creado_por'] = $user?->id;
        $datos['recibido_por'] = null;
        $datos['condicion_al_salir'] = null;
        $datos['condicion_al_recibir'] = null;
        $datos['observaciones_recepcion'] = null;
        $datos['fecha_recepcion'] = null;
        $datos['fecha_movimiento'] = $datos['fecha_movimiento'] ?? now();

        $movimiento = $this->movimientoService->registrarMovimiento($datos);

        return new MovimientoResource($movimiento);
    }

    public function update(Request $request, Movimiento $movimiento)
    {
        $datos = $request->validate([
            'bien_id' => ['sometimes', 'exists:bienes,id'],
            'creado_por' => ['sometimes', 'exists:users,id'],
            'recibido_por' => ['nullable', 'exists:users,id'],
            'area_origen_id' => ['sometimes', 'exists:areas,id'],
            'area_destino_id' => ['sometimes', 'exists:areas,id'],
            'tipo_movimiento_id' => ['sometimes', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['sometimes', 'exists:motivos,id'],
            'estado_movimiento_id' => ['sometimes', 'exists:estados_movimiento,id'],
            'condicion_al_salir' => ['nullable', 'string'],
            'condicion_al_recibir' => ['nullable', 'string'],
            'observaciones_salida' => ['nullable', 'string'],
            'observaciones_recepcion' => ['nullable', 'string'],
            'fecha_movimiento' => ['sometimes', 'date'],
            'fecha_recepcion' => ['nullable', 'date'],
        ]);

        // El estado no se puede escribir como si fuera un campo más: cada transición
        // arrastra efectos (quién y cuándo lo registró en Diaguita, la fecha de cierre,
        // limpiar el acuse si se anula). Pasarlo por actualizarEstado() evita que la
        // fila quede en un estado imposible, como "Cerrado" sin fecha de cierre.
        $estadoPedido = $datos['estado_movimiento_id'] ?? null;
        unset($datos['estado_movimiento_id']);

        if (! empty($datos)) {
            $movimiento = $this->movimientoService->actualizar($movimiento, $datos);
        }

        if ($estadoPedido && (int) $estadoPedido !== (int) $movimiento->estado_movimiento_id) {
            $movimiento = $this->movimientoService->actualizarEstado(
                $movimiento,
                (int) $estadoPedido,
                $request->user()
            );
        }

        return new MovimientoResource($movimiento);
    }
}
