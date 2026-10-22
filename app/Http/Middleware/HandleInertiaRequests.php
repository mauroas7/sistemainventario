<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $usuario = $request->user()?->loadMissing('area');

        return [
            ...parent::share($request),
            'auth' => [
                'usuario' => $usuario ? [
                    'id' => $usuario->id,
                    'nombre' => $usuario->name,
                    'email' => $usuario->email,
                    'rol' => $usuario->rol?->value,
                    'rolEtiqueta' => $usuario->rol?->etiqueta(),
                    'area' => $usuario->area?->only(['id', 'nombre']),
                ] : null,
            ],
            // Lo que los controladores dejan con ->with('success' | 'error', ...).
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
