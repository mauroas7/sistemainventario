<?php

use App\Http\Controllers\InicioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    Route::get('/recepcion/bandeja', [TicketController::class, 'inbox'])
        ->name('recepcion.bandeja');
    Route::get('/recepcion/movimientos/{movimiento}', [TicketController::class, 'showReception'])
        ->name('recepcion.show');
    Route::post('/recepcion/confirmar/{movimiento}', [TicketController::class, 'confirmReception'])
        ->name('recepcion.confirmar');
    Route::post('/recepcion/cancelar/{movimiento}', [TicketController::class, 'cancelReception'])
        ->name('recepcion.cancelar');

    Route::middleware('rol:admin')->group(function () {
        Route::get('/patrimonio/dashboard', function () {
            return Inertia::render('Patrimonio/Dashboard');
        })->name('patrimonio.dashboard');
        Route::get('/patrimonio/dashboard/exportar', [TicketController::class, 'exportarMovimientos'])
            ->name('patrimonio.dashboard.exportar');
        Route::patch('/patrimonio/movimientos/{movimiento}/estado', [TicketController::class, 'updateMovimientoEstado'])
            ->name('patrimonio.movimientos.estado');
        Route::patch('/patrimonio/movimientos/{movimiento}/responsable', [TicketController::class, 'updateMovimientoResponsable'])
            ->name('patrimonio.movimientos.responsable');

        // Localizador de Bienes
        Route::get('/patrimonio/localizador', function () {
            return Inertia::render('Patrimonio/Localizador/Index');
        })->name('patrimonio.localizador.index');

        // Directorio de Bienes
        Route::get('/patrimonio/bienes', function () {
            return Inertia::render('Patrimonio/Bienes/Index');
        })->name('patrimonio.bienes.index');

        // Historial de un Bien (Ficha)
        Route::get('/patrimonio/bienes/show', function () {
            return Inertia::render('Patrimonio/Bienes/Show');
        })->name('patrimonio.bienes.show');

        // Auditoría de un Ticket
        Route::get('/patrimonio/tickets/show', function () {
            return Inertia::render('Patrimonio/Tickets/Show');
        })->name('patrimonio.tickets.show');

        // Panel de Configuración
        Route::get('/patrimonio/configuracion', function () {
            return Inertia::render('Patrimonio/Configuracion/Index');
        })->name('patrimonio.configuracion.index');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/auth.php';
