<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovimientoResource;
use App\Models\Area;
use App\Models\EstadoMovimiento;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Services\MovimientoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** El control patrimonial: todos los movimientos del hospital, filtrados y paginados. */
class DashboardController extends Controller
{
    private const POR_PAGINA = 20;

    public function __construct(private MovimientoService $movimientoService) {}

    public function index(Request $request): Response
    {
        $filtros = $this->filtros($request);
        $paginador = $this->movimientoService->obtenerParaBandeja(null, true, $filtros, self::POR_PAGINA);

        return Inertia::render('Patrimonio/Dashboard', [
            'movimientos' => $paginador->through(fn (Movimiento $m) => (new MovimientoResource($m))->resolve($request)),
            // Sobre todo lo que matchea el filtro, no sobre la página actual.
            'resumen' => $this->movimientoService->obtenerResumen(null, true, $filtros),
            'filtros' => $filtros,
            'estados' => EstadoMovimiento::orderBy('id')->get(['id', 'nombre']),
            'areas' => Area::orderBy('nombre')->get(['id', 'nombre']),
            'motivos' => Motivo::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /** El mismo recorte que se ve filtrado, entero y no sólo la página actual. */
    public function exportar(Request $request): StreamedResponse
    {
        $movimientos = $this->movimientoService->obtenerParaBandeja(null, true, $this->filtros($request));

        $nombreArchivo = 'movimientos_'.now()->format('Y-m-d_His').'.csv';

        return response()->streamDownload(function () use ($movimientos) {
            $salida = fopen('php://output', 'w');

            // BOM UTF-8 y separador ";" para que Excel en es-AR abra el CSV sin preguntar nada.
            fwrite($salida, "\xEF\xBB\xBF");

            // En el orden del Excel que lleva Patrimonio, para pegarlo ahí sin reordenar.
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

    /** @return array<string, mixed> */
    private function filtros(Request $request): array
    {
        return $request->validate([
            'area_id' => ['nullable', 'exists:areas,id'],
            'estado_movimiento_id' => ['nullable', 'exists:estados_movimiento,id'],
            'tipo_movimiento_id' => ['nullable', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['nullable', 'exists:motivos,id'],
            'desde' => ['nullable', 'date'],
            'hasta' => ['nullable', 'date', 'after_or_equal:desde'],
            'bien' => ['nullable', 'string', 'max:255'],
        ], [
            'hasta.after_or_equal' => 'La fecha "Hasta" no puede ser anterior a "Desde".',
            'desde.date' => 'La fecha "Desde" no es válida.',
            'hasta.date' => 'La fecha "Hasta" no es válida.',
            'area_id.exists' => 'El sector seleccionado no existe.',
            'estado_movimiento_id.exists' => 'El estado seleccionado no existe.',
            'motivo_id.exists' => 'El motivo seleccionado no existe.',
        ]);
    }
}
