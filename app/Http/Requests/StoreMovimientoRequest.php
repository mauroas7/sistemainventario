<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMovimientoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bien_id' => [
                'required',
                'exists:bienes,id',
            ],

            'area_destino_id' => [
                'required',
                'different:area_origen_id',
            ],

            'tipo_movimiento_id' => [
                'required',
                'exists:tipos_movimiento,id',
            ],

            'motivo_id' => [
                'required',
                'exists:motivos,id',
            ],

            'condicion_al_salir' => [
                'nullable',
                'string',
                'max:255',
            ],

            'observaciones_salida' => [
                'nullable',
                'string',
            ],
        ];
    }
}
