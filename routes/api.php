<?php

use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\BienController;
use App\Http\Controllers\Api\EstadoBienController;
use App\Http\Controllers\Api\EstadoMovimientoController;
use App\Http\Controllers\Api\MotivoController;
use App\Http\Controllers\Api\MovimientoController;
use App\Http\Controllers\Api\TipoMovimientoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\RequerirRol;
use Illuminate\Support\Facades\Route;

// Protegemos todas las rutas API con Sanctum y aplicamos middleware de roles cuando corresponde.
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/areas', [AreaController::class, 'index']);

    Route::get('/estadoBien', [EstadoBienController::class, 'index']);

    Route::get('/estadoMovimiento', [EstadoMovimientoController::class, 'index']);

    Route::get('/tipoMovimiento', [TipoMovimientoController::class, 'index']);

    Route::get('/motivo', [MotivoController::class, 'index']);

    // El listado se filtra por área del usuario salvo que sea admin.
    Route::get('/bien', [BienController::class, 'index']);

    // Lectura: cualquier usuario autenticado, mismo scoping por área que la bandeja de recepción.
    Route::get('/movimientos', [MovimientoController::class, 'index']);
    Route::get('/movimientos/{movimiento}', [MovimientoController::class, 'show']);

    // Escritura directa por API: reservada a administradores (la creación y recepción
    // normales de tickets se hacen vía las rutas web de TicketController).
    Route::middleware(RequerirRol::class.':admin')->group(function () {
        Route::post('/movimientos', [MovimientoController::class, 'store']);
        Route::put('/movimientos/{movimiento}', [MovimientoController::class, 'update']);
        Route::patch('/movimientos/{movimiento}', [MovimientoController::class, 'update']);
    });

    // Gestión de usuarios limitada a administradores (role: admin)
    Route::get('/users', [UserController::class, 'index'])
        ->middleware(RequerirRol::class.':admin');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware(RequerirRol::class.':admin');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware(RequerirRol::class.':admin');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware(RequerirRol::class.':admin');

    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware(RequerirRol::class.':admin');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware(RequerirRol::class.':admin');
});
