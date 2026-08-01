<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaResource;
use App\Services\AreaService;

class AreaController extends Controller
{
    public function __construct(
        private AreaService $areaService
    ) {}

    public function index()
    {
        $areas = $this->areaService->obtenerTodas();

        return AreaResource::collection($areas);
    }
}
