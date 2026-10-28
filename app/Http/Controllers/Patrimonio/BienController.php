<?php

namespace App\Http\Controllers\Patrimonio;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarBienRequest;
use App\Http\Resources\BienResource;
use App\Http\Resources\MovimientoResource;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;
use App\Models\User;
use App\Services\MovimientoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** El directorio de bienes del hospital, su alta y edición, y la ficha de cada uno. */
class BienController extends Controller
{
    public function index(Request $request): Response
    {
        $bienes = Bien::with(BienResource::RELACIONES)->withCount('movimientos')->orderBy('id')->get();

        return Inertia::render('Patrimonio/Bienes/Index', [
            'bienes' => BienResource::collection($bienes)->resolve($request),
            'areas' => Area::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => EstadoBien::orderBy('id')->get(['id', 'nombre']),
            'responsables' => User::query()
                ->activos()
                ->whereNotNull('area_id')
                ->orderBy('name')
                ->get(['id', 'name', 'area_id']),
        ]);
    }

    public function store(GuardarBienRequest $request): RedirectResponse
    {
        $datos = $request->validated();

        Bien::create([...$datos, 'ubicacion_actual_id' => $datos['area_id']]);

        return back()->with('exito', 'Bien creado correctamente');
    }

    public function update(GuardarBienRequest $request, Bien $bien): RedirectResponse
    {
        $datos = $request->validated();

        if (array_key_exists('area_id', $datos)) {
            $datos['ubicacion_actual_id'] = $datos['area_id'];
        }

        $bien->update($datos);

        return back()->with('exito', 'Bien actualizado correctamente');
    }

    public function show(Request $request, Bien $bien): Response
    {
        $movimientos = $bien->movimientos()
            ->with(MovimientoService::RELACIONES)
            ->orderByDesc('fecha_movimiento')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Patrimonio/Bienes/Show', [
            'bien' => (new BienResource($bien->load(BienResource::RELACIONES)))->resolve($request),
            'movimientos' => MovimientoResource::collection($movimientos)->resolve($request),
        ]);
    }
}
