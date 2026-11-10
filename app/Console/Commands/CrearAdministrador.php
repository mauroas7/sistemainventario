<?php

namespace App\Console\Commands;

use App\Enums\Rol;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * Crea un administrador desde la consola. Es la forma de crear el primero: al
 * resto lo da de alta un administrador desde Configuración, y en un sistema
 * recién instalado todavía no hay nadie que pueda entrar.
 */
class CrearAdministrador extends Command
{
    protected $signature = 'usuarios:crear-administrador
                            {email : Correo institucional con el que va a iniciar sesión}';

    protected $description = 'Crea un usuario administrador. Sirve para el primero, cuando todavía nadie puede entrar.';

    public function handle(): int
    {
        $validador = Validator::make([
            'email' => $this->argument('email'),
            'name' => $this->ask('Nombre y apellido'),
            'password' => $this->secret('Contraseña (mínimo 8 caracteres)'),
        ], [
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validador->fails()) {
            foreach ($validador->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        $usuario = User::create([...$validador->validated(), 'rol' => Rol::Admin]);

        $this->components->info("Administrador creado: {$usuario->name} ({$usuario->email}).");

        return self::SUCCESS;
    }
}
