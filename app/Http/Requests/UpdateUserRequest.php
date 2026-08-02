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

            'area_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:areas,id',
            ],
        ];
    }
}