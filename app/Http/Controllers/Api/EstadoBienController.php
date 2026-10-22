<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EstadoBienResource;
use App\Services\EstadoBienService;

class EstadoBienController extends Controller
{
    public function __construct(
        private EstadoBienService $estadoBienService
    ) {}

    public function index()
    {
        $estadoBien = $this->estadoBienService->obtenerEstadoBien();

        return EstadoBienResource::collection($estadoBien);
    }
}
