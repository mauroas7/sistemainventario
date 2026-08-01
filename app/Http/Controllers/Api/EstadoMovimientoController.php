<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\EstadoMovimientoResource;
use App\Services\EstadoMovimientoService;

class EstadoMovimientoController extends Controller
{
    public function __construct(
        private EstadoMovimientoService $estadoMovimientoService
    ) {}

    public function index()
    {
        $estadoMovimiento = $this->estadoMovimientoService->obtenerEstadoMovimiento();

        return EstadoMovimientoResource::collection($estadoMovimiento);
    }
}
