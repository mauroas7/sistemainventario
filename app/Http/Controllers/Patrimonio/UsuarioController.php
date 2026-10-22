<?php

namespace App\Http\Controllers\Patrimonio;

use App\Enums\Rol;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Area;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Las cuentas de acceso, en Configuración. No hay registro público: el área y el rol
 * definen qué ve cada persona. Las cuentas no se borran, se dan de baja.
 */
class UsuarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Patrimonio/Configuracion/Index', [
            'areas' => Area::orderBy('nombre')->get(['id', 'nombre']),
            'usuarios' => User::with('area:id,nombre')->orderBy('name')->get()
                ->map(fn (User $usuario) => [
                    'id' => $usuario->id,
                    'name' => $usuario->name,
                    'email' => $usuario->email,
                    'rol' => $usuario->rol?->value,
                    'area_id' => $usuario->area_id,
                    'area' => $usuario->area?->only(['id', 'nombre']),
                    'activo' => $usuario->activo,
                ]),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create($request->validated());

        return back()->with('success', 'Usuario creado correctamente');
    }

    public function update(UpdateUserRequest $request, User $usuario): RedirectResponse
    {
        $datos = $request->validated();

        // Una contraseña vacía en el formulario significa "no la cambies".
        if (array_key_exists('password', $datos) && blank($datos['password'])) {
            unset($datos['password']);
        }

        // Nadie puede quitarse a sí mismo el acceso o el rol de admin y quedar afuera.
        if ($request->user()->is($usuario)) {
            if (array_key_exists('activo', $datos) && ! $datos['activo']) {
                throw ValidationException::withMessages(['general' => 'No podés desactivar tu propia cuenta.']);
            }

            if (array_key_exists('rol', $datos) && Rol::desde($datos['rol']) !== Rol::Admin) {
                throw ValidationException::withMessages(['general' => 'No podés quitarte a vos mismo el rol de administrador.']);
            }
        }

        if ($this->dejariaSinAdmin($usuario, $datos)) {
            throw ValidationException::withMessages(['general' => 'Debe quedar al menos un administrador activo en el sistema.']);
        }

        $usuario->update($datos);

        return back()->with('success', 'Usuario actualizado correctamente');
    }

    private function dejariaSinAdmin(User $usuario, array $cambios): bool
    {
        if (! $usuario->tieneRol(Rol::Admin) || ! $usuario->activo) {
            return false;
        }

        $pierdeAdmin = (array_key_exists('rol', $cambios) && Rol::desde($cambios['rol']) !== Rol::Admin)
            || (array_key_exists('activo', $cambios) && ! $cambios['activo']);

        return $pierdeAdmin && User::query()
            ->where('rol', Rol::Admin)
            ->activos()
            ->whereKeyNot($usuario->id)
            ->doesntExist();
    }
}
