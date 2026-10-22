<?php

use App\Http\Controllers\CuentaController;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\Patrimonio\BienController;
use App\Http\Controllers\Patrimonio\DashboardController;
use App\Http\Controllers\Patrimonio\LocalizadorController;
use App\Http\Controllers\Patrimonio\MovimientoController;
use App\Http\Controllers\Patrimonio\UsuarioController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Si el usuario tiene sesión activa, va al sistema. Si no, al login.
    return auth()->check() ? redirect()->route('inicio') : redirect()->route('login');
});

Route::middleware('auth')->group(function () {

    Route::get('/inicio', [InicioController::class, 'index'])
        ->name('inicio');

    Route::get('/envio/crear-ticket', [TicketController::class, 'create'])
        ->name('envio.crear');
    Route::post('/envio/crear-ticket', [TicketController::class, 'store'])
        ->name('envio.store');

    Route::get('/recepcion/bandeja', [TicketController::class, 'index'])
        ->name('recepcion.bandeja');
    Route::get('/recepcion/movimientos/{movimiento}', [TicketController::class, 'show'])
        ->name('recepcion.show');
    Route::get('/recepcion/movimientos/{movimiento}/foto', [TicketController::class, 'foto'])
        ->name('recepcion.movimientos.foto');
    Route::post('/recepcion/movimientos/{movimiento}/confirmar', [TicketController::class, 'confirmar'])
        ->name('recepcion.confirmar');
    Route::post('/recepcion/movimientos/{movimiento}/anular', [TicketController::class, 'anular'])
        ->name('recepcion.anular');

    Route::middleware('rol:admin')->prefix('patrimonio')->name('patrimonio.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard/exportar', [DashboardController::class, 'exportar'])->name('dashboard.exportar');

        Route::get('/movimientos/{movimiento}', [MovimientoController::class, 'show'])->name('movimientos.show');
        Route::patch('/movimientos/{movimiento}/estado', [MovimientoController::class, 'actualizarEstado'])
            ->name('movimientos.estado');
        Route::patch('/movimientos/{movimiento}/responsable', [MovimientoController::class, 'asignarResponsable'])
            ->name('movimientos.responsable');

        Route::get('/localizador', [LocalizadorController::class, 'index'])->name('localizador.index');

        Route::get('/bienes', [BienController::class, 'index'])->name('bienes.index');
        Route::get('/bienes/{bien}', [BienController::class, 'show'])->name('bienes.show');

        Route::get('/configuracion', [UsuarioController::class, 'index'])->name('configuracion.index');
        Route::post('/usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
        Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update'])->name('usuarios.update');
    });

    Route::get('/mi-cuenta', [CuentaController::class, 'show'])->name('cuenta');
    Route::patch('/mi-cuenta', [CuentaController::class, 'actualizar'])->name('cuenta.actualizar');
    Route::put('/mi-cuenta/clave', [CuentaController::class, 'actualizarClave'])->name('cuenta.clave');
});

require __DIR__.'/auth.php';
