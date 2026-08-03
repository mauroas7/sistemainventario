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


// Protegemos todas las rutas API con Sanctum y aplicamos middleware de roles cuando corresponde.
Route::middleware(['auth:sanctum'])->group(function () {
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
    // El listado se filtra por área del usuario salvo que sea admin.
    Route::get('/bien', [BienController::class, 'index']);


    // <------- Rutas para movimientos ------->
    // Lectura: cualquier usuario autenticado, mismo scoping por área que la bandeja de recepción.
    Route::get('/movimientos', [MovimientoController::class, 'index']);
    Route::get('/movimientos/{movimiento}', [MovimientoController::class, 'show']);

    // Escritura directa por API: reservada a administradores (la creación y recepción
    // normales de tickets se hacen vía las rutas web de TicketController).
    Route::middleware(\App\Http\Middleware\RequireRole::class . ':admin')->group(function () {
        Route::post('/movimientos', [MovimientoController::class, 'store']);
        Route::put('/movimientos/{movimiento}', [MovimientoController::class, 'update']);
        Route::patch('/movimientos/{movimiento}', [MovimientoController::class, 'update']);
    });


    // <------- Rutas para usuario ------->
    // Gestión de usuarios limitada a administradores (role: admin)
    Route::get('/users', [UserController::class, 'index'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');

    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware(\App\Http\Middleware\RequireRole::class . ':admin');
});
