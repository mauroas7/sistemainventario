<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovimientoResource extends JsonResource
{
    /**
     * Las fechas viajan en ISO 8601 con huso: el formato lo decide la pantalla.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'bien' => [
                'id' => $this->bien->id,
                'codigo' => $this->bien->codigo,
                'numero_diaguita' => $this->bien->numero_diaguita,
                'nombre' => $this->bien->nombre,
                'descripcion' => $this->bien->descripcion,
            ],

            'creado_por' => [
                'id' => $this->creador->id,
                'nombre' => $this->creador->name,
            ],

            'recibido_por' => $this->receptor ? [
                'id' => $this->receptor->id,
                'nombre' => $this->receptor->name,
            ] : null,

            'responsable_anterior' => $this->responsableAnterior ? [
                'id' => $this->responsableAnterior->id,
                'nombre' => $this->responsableAnterior->name,
            ] : null,

            'responsable_nuevo' => $this->responsableNuevo ? [
                'id' => $this->responsableNuevo->id,
                'nombre' => $this->responsableNuevo->name,
            ] : null,

            'registrado_por' => $this->registrador ? [
                'id' => $this->registrador->id,
                'nombre' => $this->registrador->name,
            ] : null,

            'area_origen' => [
                'id' => $this->areaOrigen->id,
                'nombre' => $this->areaOrigen->nombre,
            ],

            'area_destino' => [
                'id' => $this->areaDestino->id,
                'nombre' => $this->areaDestino->nombre,
            ],

            'tipo_movimiento' => [
                'id' => $this->tipoMovimiento->id,
                'nombre' => $this->tipoMovimiento->nombre,
            ],

            'motivo' => [
                'id' => $this->motivo->id,
                'nombre' => $this->motivo->nombre,
            ],

            'estado_movimiento' => [
                'id' => $this->estadoMovimiento->id,
                'nombre' => $this->estadoMovimiento->nombre,
            ],

            'observaciones_salida' => $this->observaciones_salida,
            'imagen_salida_url' => $this->imagen_salida ? route('recepcion.movimientos.foto', $this->resource) : null,

            'fecha_movimiento' => $this->fecha_movimiento?->toIso8601String(),
            'fecha_recepcion' => $this->fecha_recepcion?->toIso8601String(),
            'fecha_registro_diaguita' => $this->fecha_registro_diaguita?->toIso8601String(),
            'fecha_cierre' => $this->fecha_cierre?->toIso8601String(),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),

            // Solo viaja si quien arma la respuesta lo cargó a propósito (las pantallas
            // de detalle). En los listados sería una consulta por fila que nadie mira.
            'historial_estados' => $this->whenLoaded('historialEstados', fn () => $this->historialEstados
                ->map(fn ($cambio) => [
                    'id' => $cambio->id,
                    'estado_anterior' => $cambio->estadoAnterior?->nombre,
                    'estado_nuevo' => $cambio->estadoNuevo?->nombre,
                    'usuario' => $cambio->usuario?->name,
                    'fecha' => $cambio->created_at?->toIso8601String(),
                ])
                ->all()),
        ];
    }
}
