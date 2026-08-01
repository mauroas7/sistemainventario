<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BienResource extends JsonResource
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
            'codigo' => $this->codigo,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'area' => [
                'id' => $this->area->id,
                'nombre' => $this->area->nombre,
            ],

            'ubicacion_actual' => [
                'id' => $this->ubicacionActual->id,
                'nombre' => $this->ubicacionActual->nombre,
            ],

            'estado' => [
                'id' => $this->estado->id,
                'nombre' => $this->estado->nombre,
            ],
        ];
    }
}
