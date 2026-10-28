<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/** El alta y la edición de un bien, con las mismas reglas. */
class GuardarBienRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $bien = $this->route('bien');
        // Con movimientos, área y responsable los calcula el historial: cambian informando un traslado.
        $conMovimientos = fn () => $bien?->movimientos()->exists() ?? false;

        return [
            'codigo' => ['required', 'string', 'max:255', Rule::unique('bienes', 'codigo')->ignore($bien)],
            'numero_diaguita' => ['nullable', 'string', 'max:255', Rule::unique('bienes', 'numero_diaguita')->ignore($bien)],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'estado_id' => ['required', 'exists:estados_bien,id'],
            'area_id' => [Rule::excludeIf($conMovimientos), 'required', 'exists:areas,id'],
            'responsable_id' => [Rule::excludeIf($conMovimientos), 'nullable', Rule::exists('users', 'id')->whereNull('fecha_baja')],
        ];
    }

    /** Quien queda a cargo pertenece al área del bien, como al informar un traslado. */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty() || ! $this->filled('responsable_id') || ! array_key_exists('area_id', $validator->validated())) {
                    return;
                }

                if ((int) User::find($this->input('responsable_id'))?->area_id !== (int) $this->input('area_id')) {
                    $validator->errors()->add('responsable_id', 'El responsable seleccionado no pertenece al área del bien.');
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
            'codigo.required' => 'Ingresá el número de inventario.',
            'codigo.unique' => 'Ya hay un bien con ese número de inventario.',
            'numero_diaguita.unique' => 'Ya hay un bien con ese número de Diaguita.',
            'nombre.required' => 'Ingresá la descripción del bien.',
            'estado_id.required' => 'Seleccioná el estado del bien.',
            'area_id.required' => 'Seleccioná el área.',
            'responsable_id.exists' => 'El responsable seleccionado no existe o está dado de baja.',
        ];
    }
}
