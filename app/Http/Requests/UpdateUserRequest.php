<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user),
            ],

            'password' => [
                'sometimes',
                'required',
                'string',
                'min:8',
            ],

            'rol' => [
                'sometimes',
                'required',
                'in:admin,coordinador,usuario',
            ],

            // Ver StoreUserRequest: sin área la cuenta no ve ningún bien.
            'area_id' => [
                'exclude_if:rol,admin',
                'sometimes',
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
            'email.unique' => 'Ya existe un usuario con ese correo.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'area_id.required' => 'Seleccioná el área. Es lo que determina qué bienes va a ver.',
        ];
    }
}