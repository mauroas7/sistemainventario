<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restringe una ruta a uno o más roles: `->middleware('rol:admin')`.
 * Acepta slugs y etiquetas de `App\Enums\Rol`.
 */
class VerificarRol
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()?->tieneRol(...$roles)) {
            abort(403, 'No tenés permiso para esta acción.');
        }

        return $next($request);
    }
}
