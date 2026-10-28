<?php

namespace App\Http\Controllers;

use App\Enums\Rol;
use App\Http\Requests\GuardarMovimientoRequest;
use App\Http\Resources\MovimientoResource;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoMovimiento;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;
use App\Services\MovimientoService;
use App\Services\NotificacionMovimientoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Informar un traslado y la bandeja de recepción. */
class TicketController extends Controller
{
    /** Disco de las fotos: privado, se sirven sólo por `recepcion.movimientos.foto`. */
    private const DISCO_FOTOS = 'local';

    /**
     * Pestañas de la bandeja. Se resuelven contra los nombres de estado y no contra ids
     * fijos para no atarse al orden en que se sembró la tabla.
     */
    private const ESTADOS_POR_PESTANA = [
        'informados' => ['Informado'],
        'registrados' => ['Registrado', 'Cerrado'],
        'anulados' => ['Anulado'],
        'todos' => null,
    ];

    public function __construct(
        private MovimientoService $movimientoService,
        private NotificacionMovimientoService $notificaciones
    ) {}

    public function create(): Response
    {
        $user = Auth::user();

        $bienesQuery = Bien::query()
            ->with(['ubicacionActual', 'responsable']);

        if (! $user->tieneRol(Rol::Admin)) {
            $bienesQuery->where('area_id', $user->area_id);
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

        // Patrimonio pidió que el nuevo responsable se elija de una lista, no que se
        // escriba a mano. Las cuentas dadas de baja no pueden recibir bienes nuevos.
        $responsables = User::query()
            ->activos()
            ->with('area:id,nombre')
            ->orderBy('name')
            ->get(['id', 'name', 'area_id']);

        return Inertia::render('Envio/Create', [
            'bienes' => $bienes,
            'areas' => Area::orderBy('nombre')->get(['id', 'nombre']),
            'tiposMovimiento' => TipoMovimiento::orderBy('nombre')->get(['id', 'nombre']),
            'motivos' => Motivo::orderBy('nombre')->get(['id', 'nombre']),
            'responsables' => $responsables,
        ]);
    }

    public function store(GuardarMovimientoRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (! $user->tieneRol(Rol::Admin) && (int) $user->area_id !== (int) $validated['area_origen_id']) {
            abort(403, 'No puede informar movimientos desde un área distinta a la suya.');
        }

        $rutaImagen = $request->hasFile('imagen')
            ? $request->file('imagen')->store('movimientos', self::DISCO_FOTOS)
            : null;

        $movimiento = $this->movimientoService->registrarMovimiento([
            'bien_id' => $validated['bien_id'],
            'creado_por' => $user->id,
            'recibido_por' => null,
            'responsable_nuevo_id' => $validated['responsable_nuevo_id'] ?? null,
            'area_origen_id' => $validated['area_origen_id'],
            'area_destino_id' => $validated['area_destino_id'],
            'tipo_movimiento_id' => $validated['tipo_movimiento_id'],
            'motivo_id' => $validated['motivo_id'],
            'observaciones_salida' => $validated['observaciones_salida'] ?? null,
            'imagen_salida' => $rutaImagen,
            'fecha_recepcion' => null,
        ]);

        // Después de la transacción: el servicio de avisos no lanza excepciones, las loguea.
        $this->notificaciones->notificarMovimientoInformado($movimiento);

        return redirect()
            ->route('recepcion.bandeja')
            ->with('exito', 'Movimiento informado correctamente');
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        $pestana = (string) $request->query('estado');
        if (! array_key_exists($pestana, self::ESTADOS_POR_PESTANA)) {
            $pestana = 'informados';
        }

        $filtros = [];
        if ($nombres = self::ESTADOS_POR_PESTANA[$pestana]) {
            $filtros['estado_movimiento_id'] = EstadoMovimiento::whereIn('nombre', $nombres)->pluck('id')->all();
        }

        // Paginado: para Patrimonio son todos los movimientos del hospital.
        $paginador = $this->movimientoService->obtenerParaBandeja($user, $filtros, 25);

        return Inertia::render('Recepcion/Index', [
            'movimientos' => $paginador->through(fn (Movimiento $m) => (new MovimientoResource($m))->resolve($request)),
            'pestana' => $pestana,
            // Sobre todo lo visible para el usuario, no sobre la página: no cambian al paginar.
            'resumen' => $this->movimientoService->obtenerResumen($user, []),
        ]);
    }

    public function show(Request $request, Movimiento $movimiento): Response
    {
        $user = $request->user();
        abort_unless($this->movimientoService->puedeVer($user, $movimiento), 403);

        $movimiento->load(array_merge(MovimientoService::RELACIONES, [
            'historialEstados.estadoAnterior',
            'historialEstados.estadoNuevo',
            'historialEstados.usuario',
        ]));

        return Inertia::render('Recepcion/Show', [
            'movimiento' => (new MovimientoResource($movimiento))->resolve($request),
            // Sólo Patrimonio define el responsable de un movimiento que se informó sin
            // uno, y sólo entre el personal del área que recibió el bien.
            'responsables' => $user->tieneRol(Rol::Admin)
                ? User::query()
                    ->activos()
                    ->where('area_id', $movimiento->area_destino_id)
                    ->orderBy('name')
                    ->get(['id', 'name', 'area_id'])
                : [],
        ]);
    }

    /** La foto del bien al salir. La ve quien puede ver el movimiento. */
    public function foto(Request $request, Movimiento $movimiento): StreamedResponse
    {
        abort_unless($this->movimientoService->puedeVer($request->user(), $movimiento), 403);
        abort_unless($movimiento->imagen_salida && Storage::disk(self::DISCO_FOTOS)->exists($movimiento->imagen_salida), 404);

        return Storage::disk(self::DISCO_FOTOS)->response($movimiento->imagen_salida);
    }

    /**
     * Acuse de recibo del nuevo responsable o del coordinador del área que recibe. Es
     * opcional: el bien ya cambió de manos al informarse; sólo deja constancia.
     */
    public function confirmar(Request $request, Movimiento $movimiento): RedirectResponse
    {
        $user = $request->user();

        if ($movimiento->estadoMovimiento?->nombre === 'Anulado') {
            throw ValidationException::withMessages(['movimiento' => 'El movimiento fue anulado.']);
        }

        $esNuevoResponsable = (int) $user->id === (int) $movimiento->responsable_nuevo_id;
        $esCoordinadorDestino = $user->tieneRol(Rol::Coordinador)
            && (int) $user->area_id === (int) $movimiento->area_destino_id;

        abort_unless($user->tieneRol(Rol::Admin) || $esNuevoResponsable || $esCoordinadorDestino, 403);

        if ($movimiento->recibido_por) {
            return back()->with('exito', 'El ticket ya tenía acuse de recibo.');
        }

        $this->movimientoService->acusarRecibo($movimiento, $user);

        return back()->with('exito', 'Recepción confirmada correctamente');
    }

    /**
     * Anular un movimiento informado por error. Sólo Patrimonio o quien lo informó,
     * y únicamente mientras no se haya volcado a Diaguita.
     */
    public function anular(Request $request, Movimiento $movimiento): RedirectResponse
    {
        $user = $request->user();

        if ($movimiento->estadoMovimiento?->nombre !== 'Informado') {
            throw ValidationException::withMessages([
                'movimiento' => 'Solo se pueden anular movimientos que todavía no se registraron en Diaguita.',
            ]);
        }

        abort_unless(
            $user->tieneRol(Rol::Admin) || (int) $user->id === (int) $movimiento->creado_por,
            403,
            'Solo quien informó el movimiento o Patrimonio pueden anularlo.'
        );

        $this->movimientoService->anularMovimiento($movimiento);

        return back()->with('exito', 'Movimiento anulado correctamente');
    }
}
