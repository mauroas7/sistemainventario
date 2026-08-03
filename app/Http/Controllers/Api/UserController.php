<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Listado de usuarios con su área, que es lo que determina qué bienes ve cada uno.
     */
    public function index()
    {
        $usuarios = User::with('area')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $usuarios,
        ]);
    }

    /**
     * Alta de usuario. Las cuentas las crea Patrimonio: no hay registro público,
     * porque el área y el rol definen qué ve y qué puede hacer cada persona.
     */
    public function store(StoreUserRequest $request)
    {
        $datosValidados = $request->validated();

        $usuario = User::create($datosValidados);

        $usuario->load('area');

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'data' => $usuario,
        ], 201);
    }

    public function show(User $user)
    {
        $user->load('area');

        return response()->json([
            'data' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $datosValidados = $request->validated();

        // Una contraseña vacía en el formulario significa "no la cambies".
        if (array_key_exists('password', $datosValidados) && blank($datosValidados['password'])) {
            unset($datosValidados['password']);
        }

        // Nadie puede quitarse a sí mismo el acceso o el rol de admin y quedar afuera.
        if ((int) $request->user()->id === (int) $user->id) {
            if (array_key_exists('activo', $datosValidados) && ! $datosValidados['activo']) {
                return response()->json(['message' => 'No podés desactivar tu propia cuenta.'], 422);
            }

            if (array_key_exists('rol', $datosValidados) && $datosValidados['rol'] !== 'admin') {
                return response()->json(['message' => 'No podés quitarte a vos mismo el rol de administrador.'], 422);
            }
        }

        if ($this->dejariaSinAdmin($user, $datosValidados)) {
            return response()->json(['message' => 'Debe quedar al menos un administrador activo en el sistema.'], 422);
        }

        $user->update($datosValidados);

        $user->load('area');

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $user,
        ]);
    }

    /**
     * No se borran usuarios: se desactivan.
     *
     * Borrar rompería la FK de movimientos.creado_por y, sobre todo, dejaría sin
     * responsable a los bienes que la persona tenía a cargo. Desactivar le quita el
     * acceso y lo saca del desplegable de responsables, conservando el historial.
     */
    public function destroy(Request $request, User $user)
    {
        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json(['message' => 'No podés desactivar tu propia cuenta.'], 422);
        }

        if ($this->dejariaSinAdmin($user, ['activo' => false])) {
            return response()->json(['message' => 'Debe quedar al menos un administrador activo en el sistema.'], 422);
        }

        $user->update(['activo' => false]);
        $user->load('area');

        return response()->json([
            'message' => 'Usuario desactivado correctamente',
            'data' => $user,
        ]);
    }

    /**
     * ¿El cambio dejaría al sistema sin ningún administrador activo?
     */
    private function dejariaSinAdmin(User $user, array $cambios): bool
    {
        if ($user->rol !== 'admin' || ! $user->activo) {
            return false;
        }

        $pierdeAdmin = (array_key_exists('rol', $cambios) && $cambios['rol'] !== 'admin')
            || (array_key_exists('activo', $cambios) && ! $cambios['activo']);

        if (! $pierdeAdmin) {
            return false;
        }

        return User::query()
            ->where('rol', 'admin')
            ->where('activo', true)
            ->whereKeyNot($user->id)
            ->doesntExist();
    }
}
