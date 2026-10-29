<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Resources\BienResource;
use App\Http\Resources\MovimientoResource;
use App\Models\Bien;
use App\Services\MovimientoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** Dónde está cada bien y cuál fue su último movimiento, buscando por inventario, Diaguita o descripción. */
class LocalizadorController extends Controller
{
    private const POR_PAGINA = 10;

    public function index(Request $request): Response
    {
        $busqueda = trim($request->validate([
            'busqueda' => ['nullable', 'string', 'max:255'],
        ])['busqueda'] ?? '');

        $relacionesDelUltimo = array_map(fn (string $relacion) => "ultimoMovimiento.{$relacion}", MovimientoService::RELACIONES);

        $paginador = Bien::with([...BienResource::RELACIONES, ...$relacionesDelUltimo])
            ->when($busqueda !== '', fn ($query) => $query->buscar($busqueda))
            ->orderBy('codigo')
            ->paginate(self::POR_PAGINA)
            ->withQueryString();

        // Antes que `through()`, que reemplaza los modelos de la página por arreglos.
        $ultimosMovimientos = $paginador->getCollection()
            ->filter(fn (Bien $bien) => $bien->ultimoMovimiento)
            ->mapWithKeys(fn (Bien $bien) => [
                $bien->id => (new MovimientoResource($bien->ultimoMovimiento))->resolve($request),
            ]);

        return Inertia::render('Patrimonio/Localizador/Index', [
            'bienes' => $paginador->through(fn (Bien $bien) => (new BienResource($bien))->resolve($request)),
            'ultimosMovimientos' => $ultimosMovimientos,
            'busqueda' => $busqueda,
        ]);
    }
}
