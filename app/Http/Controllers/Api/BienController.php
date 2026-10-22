<?php

namespace App\Http\Controllers\Api;

use App\Enums\Rol;
use App\Http\Controllers\Controller;
use App\Http\Resources\BienResource;
use App\Services\BienService;
use Illuminate\Http\Request;

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
            $user->tieneRol(Rol::Admin)
        );

        return BienResource::collection($bienes);
    }
}
