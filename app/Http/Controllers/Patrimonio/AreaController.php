<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Las áreas del hospital, en Configuración. No se borran: las sostienen sus bienes y movimientos. */
class AreaController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Area::create($this->validar($request));

        return back()->with('exito', 'Área creada correctamente');
    }

    public function update(Request $request, Area $area): RedirectResponse
    {
        $area->update($this->validar($request, $area));

        return back()->with('exito', 'Área actualizada correctamente');
    }

    /** @return array<string, mixed> */
    private function validar(Request $request, ?Area $area = null): array
    {
        return $request->validate([
            'nombre' => ['required', 'string', 'max:120', Rule::unique('areas', 'nombre')->ignore($area)],
        ], [
            'nombre.required' => 'Ingresá el nombre del área.',
            'nombre.unique' => 'Ya hay un área con ese nombre.',
        ]);
    }
}
