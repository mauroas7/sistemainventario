<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\BienResource;
use App\Services\BienService;

class BienController extends Controller
{
    public function __construct(
        private BienService $bienService
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $bienes = $this->bienService->obtenerBienes(
            $user?->area_id,
            $user?->rol === 'admin'
        );

        return BienResource::collection($bienes);
    }
}
