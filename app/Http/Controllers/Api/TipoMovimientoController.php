<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TipoMovimientoResource;
use App\Services\TipoMovimientoService;

class TipoMovimientoController extends Controller
{
    public function __construct(
        private TipoMovimientoService $tipoMovimientoService
    ) {}

    public function index()
    {
        $tipoMovimiento = $this->tipoMovimientoService->obtenerTipoMovimiento();

        return TipoMovimientoResource::collection($tipoMovimiento);
    }
}
