<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActualizarCuentaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/** Los datos y la clave de la propia cuenta. La baja la hace Patrimonio desde Configuración. */
class CuentaController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Cuenta');
    }

    public function actualizar(ActualizarCuentaRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return to_route('cuenta');
    }

    public function actualizarClave(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
