<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use App\Models\Movimiento;
use App\Models\EstadoMovimiento;
use App\Models\Bien;

class MovimientoService
{
    // Obtener todos los movimientos.
    public function obtenerTodos()
    {
        return Movimiento::with([               // Este with se podría poner en un solo método y que tanto obtenerTodos()
            'bien',                             // y obtenerPorId() lo reutilicen. También, sería útil para nuevos métodos
            'creador',                          // que tengan que hacer lo mismo.
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ])
            ->orderByDesc('fecha_movimiento')
            ->get();
    }

    // Crear un movimiento.
    public function crear(array $datos): Movimiento
    {
        $usuario = auth()->user();

        // Obtiene el bien.
        $bien = Bien::findOrFail($datos['bien_id']);

        // 1. El bien debe encontrarse físicamente en el área del usuario.
        if ($bien->ubicacion_actual_id !== $usuario->area_id) {
            throw new \Exception(
                'No puede mover un bien que no se encuentra en su área.'
            );
        }

        // 2. El área destino debe ser distinta del área origen.
        if ((int) $datos['area_destino_id'] === (int) $usuario->area_id) {
            throw ValidationException::withMessages([
                'area_destino_id' => [
                    'El área de destino debe ser distinta del área de origen.'
                ]
            ]);
        }

        // 3. El bien no puede tener otro movimiento pendiente.
        $movimientoPendiente = Movimiento::where('bien_id', $bien->id)
            ->whereHas('estadoMovimiento', function ($query) {
                $query->where('nombre', 'Pendiente');
            })
            ->exists();

        if ($movimientoPendiente) {
            throw ValidationException::withMessages([
                'bien_id' => [
                    'El bien ya posee un movimiento pendiente.'
                ]
            ]);
        }

        // Completa automáticamente los datos del movimiento.
        $datos['creado_por'] = $usuario->id;
        $datos['area_origen_id'] = $usuario->area_id;
        $datos['estado_movimiento_id'] = 1; // Pendiente
        $datos['fecha_movimiento'] = now();

        // Crea el movimiento.
        $movimiento = Movimiento::create($datos);

        // Retorna el movimiento con sus relaciones.
        return $movimiento->load([
            'bien',
            'creador',
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ]);
    }

    // Actualizar un movimiento.
    public function actualizar(Movimiento $movimiento, array $datos)
    {
        $movimiento->update($datos);

        return $movimiento->fresh([
            'bien',
            'creador',
            'receptor',
            'areaOrigen',
            'areaDestino',
            'tipoMovimiento',
            'motivo',
            'estadoMovimiento',
        ]);
    }
}
