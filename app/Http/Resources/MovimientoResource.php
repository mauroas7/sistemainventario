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

            'condicion_al_salir' => $this->condicion_al_salir,
            'condicion_al_recibir' => $this->condicion_al_recibir,

            'observaciones_salida' => $this->observaciones_salida,
            // Ruta relativa a propósito (no Storage::url(), que arma una URL absoluta con
            // APP_URL): así la imagen carga sin importar si se accede por dominio o IP de LAN.
            'imagen_salida_url' => $this->imagen_salida ? '/storage/' . $this->imagen_salida : null,
            'observaciones_recepcion' => $this->observaciones_recepcion,

            'fecha_movimiento' => $this->fecha_movimiento,
            'fecha_recepcion' => $this->fecha_recepcion,
            'fecha_registro_diaguita' => $this->fecha_registro_diaguita,
            'fecha_cierre' => $this->fecha_cierre,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
