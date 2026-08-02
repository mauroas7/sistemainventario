<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\EstadoBienController;
use App\Http\Controllers\Api\EstadoMovimientoController;
use App\Http\Controllers\Api\TipoMovimientoController;
use App\Http\Controllers\Api\MotivoController;
use App\Http\Controllers\Api\BienController;
use App\Http\Controllers\Api\MovimientoController;
use App\Http\Controllers\Api\UserController;


// <------- Rutas para areas ------->
Route::get('/areas', [AreaController::class, 'index']);

// <------- Rutas para estado del bien ------->
Route::get('/estadoBien', [EstadoBienController::class, 'index']);

// <------- Rutas para estado del movimiento ------->
Route::get('/estadoMovimiento', [EstadoMovimientoController::class, 'index']);

// <------- Rutas para tipo del movimiento ------->
Route::get('/tipoMovimiento', [TipoMovimientoController::class, 'index']);

// <------- Rutas para motivo del movimiento ------->
Route::get('/motivo', [MotivoController::class, 'index']);

// <------- Rutas para bienes ------->
Route::get('/bien', [BienController::class, 'index']);


// <------- Rutas para movimientos ------->

// Esto genera automáticamente las siguientes rutas:
//     - /api/movimientos               --> index()
//     - /api/movimientos/{movimiento}  --> show()
//     - /api/movimientos               --> store()
//     - /api/movimientos/{movimiento}  --> update()
Route::apiResource('movimientos', MovimientoController::class)
    ->only(['index', 'show', 'store', 'update']);


// <------- Rutas para usuario ------->

// Obtener usuarios
Route::get('/users', [UserController::class, 'index']);

// Registrar usuario 
Route::post('/users', [UserController::class, 'store']);

// Devuelve un usuario con su area
Route::get('/users/{user}', [UserController::class, 'show']);

// Actualiza completamente un usuario
Route::put('/users/{user}', [UserController::class, 'update']);

// Solo actualiza algunos campos
Route::patch('/users/{user}', [UserController::class, 'update']);

// Eliminar usuario
Route::delete('/users/{user}', [UserController::class, 'destroy']);
