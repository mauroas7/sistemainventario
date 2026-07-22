<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/* Ruta Raíz Inteligente */
Route::get('/', function () {
    // Si el usuario tiene sesión activa, va al sistema. Si no, al login.
    return auth()->check() ? redirect()->route('inicio') : redirect()->route('login');
});

/* Rutas del Sistema (Requieren Autenticación) */
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- RUTAS OPERATIVAS ---

    Route::get('/inicio', function () {
        return Inertia::render('Inicio/Index');
    })->name('inicio');

    Route::get('/envio/crear-ticket', function () {
        return Inertia::render('Envio/Create');
    })->name('envio.crear');

    Route::get('/recepcion/bandeja', function () {
        return Inertia::render('Recepcion/Index');
    })->name('recepcion.bandeja');


    // --- RUTAS DE PATRIMONIO ---

    Route::get('/patrimonio/dashboard', function () {
        return Inertia::render('Patrimonio/Dashboard');
    })->name('patrimonio.dashboard');

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


    // --- RUTAS DE PERFIL (BREEZE) ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';