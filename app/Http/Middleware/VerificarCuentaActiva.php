<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/** Corta la sesión de una cuenta dada de baja, aunque la tuviera abierta o con «recordarme». */
class VerificarCuentaActiva
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if ($usuario && ! $usuario->activo) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Esta cuenta está desactivada. Comunicate con Gestión de Bienes e Insumos.',
            ]);
        }

        return $next($request);
    }
}
