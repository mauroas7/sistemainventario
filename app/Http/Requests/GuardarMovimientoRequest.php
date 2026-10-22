<?php

namespace App\Http\Requests;

use App\Models\Bien;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class GuardarMovimientoRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'bien_id' => ['required', 'exists:bienes,id'],
            'area_origen_id' => ['required', 'exists:areas,id'],
            'area_destino_id' => ['required', 'exists:areas,id', 'different:area_origen_id'],
            'tipo_movimiento_id' => ['required', 'exists:tipos_movimiento,id'],
            'motivo_id' => ['required', 'exists:motivos,id'],
            // Opcional a propósito: quien informa no siempre sabe quién lo recibe, y un
            // responsable falso es peor que uno pendiente. Vacío, lo asigna Patrimonio.
            'responsable_nuevo_id' => ['nullable', 'exists:users,id'],
            'observaciones_salida' => ['nullable', 'string'],
            'imagen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /** El bien sale del área donde está, y quien lo recibe pertenece al área de destino. */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                if ((int) Bien::find($this->input('bien_id'))?->area_id !== (int) $this->input('area_origen_id')) {
                    $validator->errors()->add('area_origen_id', 'El área de origen no coincide con la ubicación actual del bien.');
                }

                $responsable = $this->filled('responsable_nuevo_id') ? User::find($this->input('responsable_nuevo_id')) : null;

                if ($responsable && (int) $responsable->area_id !== (int) $this->input('area_destino_id')) {
                    $validator->errors()->add('responsable_nuevo_id', 'El responsable seleccionado no pertenece al área de destino.');
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'bien_id.required' => 'Seleccioná un bien.',
            'area_destino_id.required' => 'Seleccioná el destino.',
            'area_destino_id.different' => 'El destino no puede ser el mismo que el origen.',
            'tipo_movimiento_id.required' => 'Seleccioná un tipo de movimiento.',
            'motivo_id.required' => 'Seleccioná un motivo.',
            'responsable_nuevo_id.exists' => 'El responsable seleccionado no existe.',
            'imagen.mimes' => 'El archivo debe ser una imagen (JPG, PNG o WEBP).',
            'imagen.max' => 'La imagen no puede pesar más de 5 MB.',
        ];
    }
}
