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
     * Display a listing of the resource.
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
     * Store a newly created resource in storage.
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
     * Display the specified resource.
     */
   public function show(User $user)
{
    $user->load('area');

    return response()->json([
        'data' => $user,
    ]);
}

    /**
     * Update the specified resource in storage.
     */
   public function update(UpdateUserRequest $request, User $user)
{
    $datosValidados = $request->validated();

    $user->update($datosValidados);

    $user->load('area');

    return response()->json([
        'message' => 'Usuario actualizado correctamente',
        'data' => $user,
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(User $user)
{
    $user->delete();

    return response()->json([
        'message' => 'Usuario eliminado correctamente',
    ]);
}
}
