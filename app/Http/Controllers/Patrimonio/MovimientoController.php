<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovimientoResource;
use App\Models\Movimiento;
use App\Models\User;
use App\Services\MovimientoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Lo que Patrimonio hace sobre un movimiento ya informado. Un movimiento no se edita:
 * sólo avanza el trámite o se le define el responsable, y cada cambio de estado queda
 * en la bitácora. Un dato mal cargado se corrige anulando e informando de nuevo.
 */
class MovimientoController extends Controller
{
    public function __construct(private MovimientoService $movimientoService) {}

    public function show(Request $request, Movimiento $movimiento): Response
    {
        $movimiento->load(array_merge(MovimientoService::RELACIONES, [
            'historialEstados.estadoAnterior',
            'historialEstados.estadoNuevo',
            'historialEstados.usuario',
        ]));

        return Inertia::render('Patrimonio/Movimientos/Show', [
            'movimiento' => (new MovimientoResource($movimiento))->resolve($request),
        ]);
    }

    public function actualizarEstado(Request $request, Movimiento $movimiento): RedirectResponse
    {
        $validado = $request->validate([
            'estado_movimiento_id' => ['required', 'exists:estados_movimiento,id'],
        ]);

        $this->movimientoService->actualizarEstado($movimiento, (int) $validado['estado_movimiento_id'], $request->user());

        return back()->with('exito', 'Estado actualizado correctamente');
    }

    /** Define el responsable de un movimiento que se informó sin uno. */
    public function asignarResponsable(Request $request, Movimiento $movimiento): RedirectResponse
    {
        $validado = $request->validate([
            'responsable_nuevo_id' => ['nullable', 'exists:users,id'],
        ], [
            'responsable_nuevo_id.exists' => 'El responsable seleccionado no existe.',
        ]);

        // Como al informar el movimiento: el responsable pertenece al área que recibió el bien.
        $responsable = isset($validado['responsable_nuevo_id']) ? User::find($validado['responsable_nuevo_id']) : null;

        if ($responsable && (int) $responsable->area_id !== (int) $movimiento->area_destino_id) {
            throw ValidationException::withMessages([
                'responsable_nuevo_id' => 'El responsable seleccionado no pertenece al área de destino.',
            ]);
        }

        $this->movimientoService->asignarResponsable($movimiento, $responsable?->id);

        return back()->with('exito', 'Responsable actualizado correctamente');
    }
}
