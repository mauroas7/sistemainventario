<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Listar todos los usuarios.
     */
    public function index()
    {
        $usuarios = User::with('area')
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $usuarios,
        ]);
    }

    /**
     * Crear un usuario.
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

    /**
     * Mostrar un usuario.
     */
    public function show(User $user)
    {
        $user->load('area');

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Actualizar un usuario.
     */
    public function update(
        UpdateUserRequest $request,
        User $user
    ) {
        $datosValidados = $request->validated();

        $user->update($datosValidados);

        $user->load('area');

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $user,
        ]);
    }

    /**
     * Eliminar un usuario.
     */
    public function destroy(User $user)
    {
        
    $user->delete("");

        return response()->json([
            'message' => 'Usuario eliminado correctamente',
        ]);
    }
}