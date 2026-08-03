<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
        'name' => [
            'required',
            'string',
            'max:255',
        ],

        'email' => [
            'required',
            'email',
            'max:255',
            'unique:users,email',
        ],

        'password' => [
            'required',
            'string',
            'min:8',
        ],

        'rol' => [
            'required',
            'in:admin,coordinador,usuario',
        ],

        // El área define qué bienes ve la persona: sin ella la cuenta queda ciega.
        // Solo Patrimonio (admin), que ve todo, puede quedar sin área asignada.
        'area_id' => [
            'exclude_if:rol,admin',
            'required',
            'integer',
            'exists:areas,id',
        ],

        'activo' => [
            'sometimes',
            'boolean',
        ],
    ];
}

    public function messages(): array
    {
        return [
            'name.required' => 'Ingresá el nombre y apellido.',
            'email.required' => 'Ingresá el correo institucional.',
            'email.unique' => 'Ya existe un usuario con ese correo.',
            'password.required' => 'Asigná una contraseña inicial.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'rol.required' => 'Seleccioná un rol.',
            'area_id.required' => 'Seleccioná el área. Es lo que determina qué bienes va a ver.',
        ];
    }
}
