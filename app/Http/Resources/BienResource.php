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
            // Numeración interna del Excel de Patrimonio (arranca en 2010).
            'codigo' => $this->codigo,
            // Numeración de Diaguita; null mientras el bien no esté cargado ahí.
            'numero_diaguita' => $this->numero_diaguita,
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

            'responsable' => $this->responsable ? [
                'id' => $this->responsable->id,
                'nombre' => $this->responsable->name,
            ] : null,

            'estado' => [
                'id' => $this->estado->id,
                'nombre' => $this->estado->nombre,
            ],
        ];
    }
}
