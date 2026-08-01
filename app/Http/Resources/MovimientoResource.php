<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovimientoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
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
                'nombre' => $this->bien->nombre,
            ],

            'creado_por' => [
                'id' => $this->creador->id,
                'nombre' => $this->creador->name,
            ],

            'recibido_por' => $this->receptor ? [
                'id' => $this->receptor->id,
                'nombre' => $this->receptor->name,
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

            'condicion_al_salir' => $this->condicion_al_salir,
            'condicion_al_recibir' => $this->condicion_al_recibir,

            'observaciones_salida' => $this->observaciones_salida,
            'observaciones_recepcion' => $this->observaciones_recepcion,

            'fecha_movimiento' => $this->fecha_movimiento,
            'fecha_recepcion' => $this->fecha_recepcion,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
