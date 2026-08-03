<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Bien;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\EstadoMovimiento;
use App\Models\TipoMovimiento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TicketController extends Controller
{
    public function __construct(
        private \App\Services\MovimientoService $movimientoService,
        private \App\Services\NotificacionMovimientoService $notificaciones
    ) {}

    public function create(): Response
    {
        $user = Auth::user();

        $bienesQuery = Bien::query()
            ->with(['ubicacionActual', 'responsable']);

        if (! $user || $user->rol !== 'admin') {
            $bienesQuery->where('area_id', $user?->area_id);
        }

        $bienes = $bienesQuery
            ->orderBy('codigo')
            ->get([
                'id',
                'codigo',
                'numero_diaguita',
                'nombre',
                'descripcion',
                'area_id',
                'ubicacion_actual_id',
                'responsable_id',
                'estado_id',
            ]);

        $areas = Area::query()
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $tiposMovimiento = TipoMovimiento::query()
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $motivos = Motivo::query()
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        // Desplegable de "a quién se la lleva": Patrimonio pidió que el nuevo
        // responsable se elija de una lista, no que se escriba a mano. Las cuentas
        // dadas de baja no pueden recibir bienes nuevos.
        $responsables = \App\Models\User::query()
            ->activos()
            ->with('area:id,nombre')
            ->orderBy('name')
            ->get(['id', 'name', 'area_id']);

        return Inertia::render('Envio/Create', [
            'bienes' => $bienes,
            'areas' => $areas,
            'tiposMovimiento' => $tiposMovimiento,
            'motivos' => $motivos,
            'responsables' => $responsables,
        ]);
    }

    public function inbox(): Response
    {
        $user = Auth::user();

        $movimientos = $this->movimientoService->obtenerParaBandeja(
            $user?->area_id,
            $user?->rol === 'admin'
        );

        return Inertia::render('Recepcion/Index', [
            // Va por el Resource y no por los modelos crudos: el front espera esta forma
            // (creado_por / responsable_nuevo como objetos con "nombre"), no las columnas
            // FK que serializa Eloquent por defecto.
            'movimientos' => \App\Http\Resources\MovimientoResource::collection($movimientos)->resolve(request()),
        ]);
    }

    public function showReception(Movimiento $movimiento): Response
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $puedeVer = $user->rol === 'admin'
            || (int) $user->area_id === (int) $movimiento->area_origen_id
            || (int) $user->area_id === (int) $movimiento->area_destino_id;

        abort_unless($puedeVer, 403);

        $movimiento->load(\App\Services\MovimientoService::RELACIONES);

        return Inertia::render('Recepcion/Show', [
            'movimiento' => (new \App\Http\Resources\MovimientoResource($movimiento))->resolve(request()),
            // Solo Patrimonio puede definir el responsable de un movimiento que se
            // informó sin uno, y solo entre el personal del área que recibió el bien.
            'responsables' => $user->rol === 'admin'
                ? \App\Models\User::query()
                    ->activos()
                    ->where('area_id', $movimiento->area_destino_id)
                    ->orderBy('name')
                    ->get(['id', 'name', 'area_id'])
                : [],
        ]);
    }

    /**
     * Acuse de recibo del nuevo responsable. Es opcional: el bien ya cambió de manos
     * cuando se informó el movimiento, esto solo deja constancia de que está al tanto.
     */
    public function confirmReception(Request $request, Movimiento $movimiento)
    {
        $user = Auth::user();
        abort_unless($user, 403);

        if ($movimiento->estadoMovimiento?->nombre === 'Anulado') {
            abort(409, 'El movimiento fue anulado.');
        }

        $esNuevoResponsable = (int) $user->id === (int) $movimiento->responsable_nuevo_id;
        $esAreaDestino = (int) $user->area_id === (int) $movimiento->area_destino_id;

        if ($user->rol !== 'admin' && ! $esNuevoResponsable && ! $esAreaDestino) {
            abort(403);
        }

        if ($movimiento->recibido_por) {
            return back()->with('success', 'El ticket ya tenía acuse de recibo.');
        }

        $movimiento = $this->movimientoService->acusarRecibo($movimiento, $user);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Recepción confirmada correctamente',
                'data' => new \App\Http\Resources\MovimientoResource($movimiento),
            ]);
        }

        return back()->with('success', 'Recepción confirmada correctamente');
    }

    /**
     * Anular un movimiento informado por error. Solo Patrimonio o quien lo informó,
     * y únicamente mientras no se haya volcado a Diaguita.
     */
    public function cancelReception(Request $request, Movimiento $movimiento)
    {
        $user = Auth::user();
        abort_unless($user, 403);

        if ($movimiento->estadoMovimiento?->nombre !== 'Informado') {
            abort(409, 'Solo se pueden anular movimientos que todavía no se registraron en Diaguita.');
        }

        if ($user->rol !== 'admin' && (int) $user->id !== (int) $movimiento->creado_por) {
            abort(403, 'Solo quien informó el movimiento o Patrimonio pueden anularlo.');
        }

        $movimiento = $this->movimientoService->anularMovimiento($movimiento);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Movimiento anulado correctamente',
                'data' => new \App\Http\Resources\MovimientoResource($movimiento),
            ]);
        }

        return back()->with('success', 'Movimiento anulado correctamente');
    }

    /**
     * Patrimonio define el responsable de un movimiento que se informó sin uno.
     */
    public function updateMovimientoResponsable(Request $request, Movimiento $movimiento)
    {
        $user = Auth::user();
        abort_unless($user && $user->rol === 'admin', 403);

        $validated = $request->validate([
            'responsable_nuevo_id' => ['nullable', 'exists:users,id'],
        ], [
            'responsable_nuevo_id.exists' => 'El responsable seleccionado no existe.',
        ]);

        // Mismo criterio que al informar el movimiento: el responsable pertenece al
        // área que recibió el bien.
        if (! empty($validated['responsable_nuevo_id'])) {
            $responsable = \App\Models\User::findOrFail($validated['responsable_nuevo_id']);

            if ((int) $responsable->area_id !== (int) $movimiento->area_destino_id) {
                abort(422, 'El responsable seleccionado no pertenece al área de destino.');
            }
        }

        $movimiento = $this->movimientoService->asignarResponsable(
            $movimiento,
            $validated['responsable_nuevo_id'] ?? null
        );

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Responsable actualizado correctamente',
                'data' => new \App\Http\Resources\MovimientoResource($movimiento),
            ]);
        }

        return back()->with('success', 'Responsable actualizado correctamente');
    }

    public function updateMovimientoEstado(Request $request, Movimiento $movimiento)
    {
        $user = Auth::user();
        abort_unless($user && $user->rol === 'admin', 403);

        $validated = $request->validate([
            'estado_movimiento_id' => ['required', 'exists:estados_movimiento,id'],
        ]);

        $movimiento = $this->movimientoService->actualizarEstado(
            $movimiento,
            (int) $validated['estado_movimiento_id'],
            $user
        );

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Estado actualizado correctamente',
                'data' => new \App\Http\Resources\MovimientoResource($movimiento),
            ]);
        }

        return back()->with('success', 'Estado actualizado correctamente');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        abort_unless($user, 403);

        $validated = $request->validate([
            'bien_id' => ['required', 'exists:bienes,id'],
            'area_origen_id' => ['required', 'exists:areas,id'],
            'area_destino_id' => ['required', 'exists:areas,id', 'different:area_origen_id'],
            'tipo_movimiento_id' => ['required', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['required', 'exists:motivos,id'],
            // Opcional a propósito: quien informa el traslado no siempre sabe qué
            // persona del área destino lo va a recibir (ej. mandar algo a reparar a
            // Mantenimiento). Obligarlo llevaría a elegir a cualquiera, y un
            // responsable falso es peor que uno pendiente de definir. Si queda vacío,
            // el movimiento entra a la cola de Patrimonio para asignarlo.
            'responsable_nuevo_id' => ['nullable', 'exists:users,id'],
            'observaciones_salida' => ['nullable', 'string'],
            'imagen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ], [
            'bien_id.required' => 'Seleccioná un bien.',
            'area_destino_id.required' => 'Seleccioná el destino.',
            'area_destino_id.different' => 'El destino no puede ser el mismo que el origen.',
            'tipo_movimiento_id.required' => 'Seleccioná un tipo de movimiento.',
            'motivo_id.required' => 'Seleccioná un motivo.',
            'responsable_nuevo_id.exists' => 'El responsable seleccionado no existe.',
            'imagen.image' => 'El archivo debe ser una imagen (JPG, PNG o WEBP).',
            'imagen.mimes' => 'El archivo debe ser una imagen (JPG, PNG o WEBP).',
            'imagen.max' => 'La imagen no puede pesar más de 5 MB.',
        ]);

        $bien = Bien::findOrFail($validated['bien_id']);

        if ($user->rol !== 'admin' && (int) $user->area_id !== (int) $validated['area_origen_id']) {
            abort(403, 'No puede informar movimientos desde un área distinta a la suya.');
        }

        if ((int) $bien->area_id !== (int) $validated['area_origen_id']) {
            abort(422, 'El área de origen no coincide con la ubicación actual del bien.');
        }

        // Quien queda a cargo tiene que pertenecer al área que recibe el bien.
        if (! empty($validated['responsable_nuevo_id'])) {
            $responsable = \App\Models\User::findOrFail($validated['responsable_nuevo_id']);

            if ((int) $responsable->area_id !== (int) $validated['area_destino_id']) {
                abort(422, 'El responsable seleccionado no pertenece al área de destino.');
            }
        }

        $rutaImagen = $request->hasFile('imagen')
            ? $request->file('imagen')->store('movimientos', 'public')
            : null;

        $movimiento = $this->movimientoService->registrarMovimiento([
            'bien_id' => $validated['bien_id'],
            'creado_por' => $user->id,
            'recibido_por' => null,
            // Puede no venir: el traslado se informa igual y Patrimonio define después
            // quién queda a cargo.
            'responsable_nuevo_id' => $validated['responsable_nuevo_id'] ?? null,
            'area_origen_id' => $validated['area_origen_id'],
            'area_destino_id' => $validated['area_destino_id'],
            'tipo_movimiento_id' => $validated['tipo_movimiento_id'],
            'motivo_id' => $validated['motivo_id'],
            'condicion_al_salir' => null,
            'condicion_al_recibir' => null,
            'observaciones_salida' => $validated['observaciones_salida'] ?? null,
            'imagen_salida' => $rutaImagen,
            'observaciones_recepcion' => null,
            'fecha_recepcion' => null,
        ]);

        // Los avisos van después de la transacción y no pueden tumbar el registro:
        // el servicio de notificaciones traga sus propios errores y los loguea.
        $this->notificaciones->notificarMovimientoInformado($movimiento);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Movimiento informado correctamente',
                'data' => new \App\Http\Resources\MovimientoResource($movimiento),
            ], 201);
        }

        return redirect()
            ->route('recepcion.bandeja')
            ->with('success', 'Movimiento informado correctamente');
    }

    // Exporta a CSV el mismo recorte de movimientos que se ve filtrado en el
    // Dashboard patrimonial (no solo la página actual: todo lo que matchea el filtro).
    public function exportarMovimientos(Request $request): StreamedResponse
    {
        $user = Auth::user();
        abort_unless($user && $user->rol === 'admin', 403);

        $filtros = $request->validate([
            'area_id' => ['nullable', 'exists:areas,id'],
            'estado_movimiento_id' => ['nullable', 'exists:estados_movimiento,id'],
            'tipo_movimiento_id' => ['nullable', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['nullable', 'exists:motivos,id'],
            'desde' => ['nullable', 'date'],
            'hasta' => ['nullable', 'date', 'after_or_equal:desde'],
            'bien' => ['nullable', 'string', 'max:255'],
        ]);

        $movimientos = $this->movimientoService->obtenerParaBandeja(null, true, $filtros);

        $nombreArchivo = 'movimientos_' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($movimientos) {
            $salida = fopen('php://output', 'w');

            // BOM UTF-8 + separador ";" para que Excel en es-AR/es-ES abra el CSV
            // directamente sin pedir configuración de codificación ni de columnas.
            fwrite($salida, "\xEF\xBB\xBF");

            // Las columnas siguen el orden del Excel que lleva Patrimonio, para que el
            // archivo se pueda pegar ahí directamente sin reordenar nada.
            fputcsv($salida, [
                'N° Inventario', 'N° Diaguita', 'Fecha', 'Ubicación anterior', 'Nueva ubicación',
                'Responsable anterior', 'Nuevo responsable', 'Descripción del bien',
                'Motivo del traslado', 'Informado por', 'Estado', 'Registrado en Diaguita',
            ], ';');

            foreach ($movimientos as $m) {
                fputcsv($salida, [
                    $m->bien->codigo,
                    $m->bien->numero_diaguita ?: 'sin cargar',
                    optional($m->fecha_movimiento)->format('d/m/Y H:i'),
                    $m->areaOrigen->nombre,
                    $m->areaDestino->nombre,
                    $m->responsableAnterior->name ?? 'sin asignar',
                    $m->responsableNuevo->name ?? 'sin asignar',
                    $m->bien->descripcion ?: $m->bien->nombre,
                    $m->motivo->nombre,
                    $m->creador->name,
                    $m->estadoMovimiento->nombre,
                    optional($m->fecha_registro_diaguita)->format('d/m/Y H:i') ?: '',
                ], ';');
            }

            fclose($salida);
        }, $nombreArchivo, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
