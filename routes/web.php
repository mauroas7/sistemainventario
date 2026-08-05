<?php
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Ruta raíz
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // Si hay sesión activa, va al inicio. Si no, va al login.
  return Auth::check()
    ? redirect()->route('inicio')
    : redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Rutas que requieren autenticación
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Rutas disponibles para todos los roles
    |--------------------------------------------------------------------------
    | usuario, coordinador y admin
    */

    Route::get('/inicio', [InicioController::class, 'index'])
        ->name('inicio');

    Route::get('/envio/crear-ticket', [TicketController::class, 'create'])
        ->name('envio.crear');

    Route::get('/recepcion/bandeja', [TicketController::class, 'inbox'])
        ->name('recepcion.bandeja');


    /*
    |--------------------------------------------------------------------------
    | Rutas para coordinador y administrador
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:coordinador,admin')->group(function () {

        Route::get('/patrimonio/dashboard', function () {
            return Inertia::render('Patrimonio/Dashboard');
        })->name('patrimonio.dashboard');

        Route::get('/patrimonio/bienes', function () {
            return Inertia::render('Patrimonio/Bienes/Index');
        })->name('patrimonio.bienes.index');

        Route::get('/patrimonio/bienes/show', function () {
            return Inertia::render('Patrimonio/Bienes/Show');
        })->name('patrimonio.bienes.show');

        Route::get('/patrimonio/tickets/show', function () {
            return Inertia::render('Patrimonio/Tickets/Show');
        })->name('patrimonio.tickets.show');
    });


    /*
    |--------------------------------------------------------------------------
    | Rutas exclusivas del administrador
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::get('/patrimonio/configuracion', function () {
            return Inertia::render('Patrimonio/Configuracion/Index');
        })->name('patrimonio.configuracion.index');
    });


    /*
    |--------------------------------------------------------------------------
    | Perfil disponible para todos los roles
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__.'/auth.php';