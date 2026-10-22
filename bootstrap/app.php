<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RequerirRol;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Env;
use Symfony\Component\HttpFoundation\Response;

// `putenv()` es del proceso, y Apache con mod_php atiende cada pedido en un hilo:
// sin el adaptador, dos pedidos a la vez se pisan el .env y uno responde 500 sin APP_KEY.
Env::disablePutenv();

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'rol' => RequerirRol::class,
        ]);

        // Quien ya tiene sesión y abre /login va al Inicio: el destino por
        // defecto de Laravel es una ruta 'dashboard', que acá no existe.
        $middleware->redirectUsersTo(fn () => route('inicio'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Una visita de Inertia que recibe un 419 o un 429 abre el modal de error
        // crudo, en inglés: vuelve a la pantalla con el aviso. Sin sesión (la que
        // venció) no hay a dónde volver, así que va al login.
        $exceptions->respond(function (Response $respuesta, Throwable $e, Request $request) {
            if (! $request->header('X-Inertia')) {
                return $respuesta;
            }

            return match ($respuesta->getStatusCode()) {
                419 => $request->user()
                    ? back()->with('error', 'La página estuvo abierta mucho tiempo. Volvé a intentarlo.')
                    : redirect()->route('login')->with('status', 'Tu sesión venció. Volvé a ingresar.'),
                429 => back()->with('error', 'Hiciste demasiados intentos. Esperá un minuto y probá de nuevo.'),
                default => $respuesta,
            };
        });
    })->create();
