<?php

namespace App\Http\Controllers;

use App\Http\Resources\BienResource;
use App\Models\Bien;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** Los bienes del área de quien entra: los mismos que puede informar en un envío. */
class MisBienesController extends Controller
{
    private const POR_PAGINA = 20;

    public function index(Request $request): Response
    {
        $busqueda = trim($request->validate([
            'busqueda' => ['nullable', 'string', 'max:255'],
        ])['busqueda'] ?? '');

        $paginador = Bien::with(BienResource::RELACIONES)
            ->where('area_id', $request->user()->area_id)
            ->when($busqueda !== '', fn ($query) => $query->buscar($busqueda))
            ->orderBy('codigo')
            ->paginate(self::POR_PAGINA)
            ->withQueryString();

        return Inertia::render('MisBienes/Index', [
            'bienes' => $paginador->through(fn (Bien $bien) => (new BienResource($bien))->resolve($request)),
            'busqueda' => $busqueda,
        ]);
    }
}
