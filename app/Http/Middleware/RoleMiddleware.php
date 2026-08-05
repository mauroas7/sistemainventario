<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles
    ): Response {
        $usuario = $request->user();

        if (!$usuario) {
            abort(401, 'Usuario no autenticado');
        }

        if (!in_array($usuario->rol, $roles, true)) {
            abort(403, 'No tenés permiso para acceder a esta sección');
        }

        return $next($request);
    }
}