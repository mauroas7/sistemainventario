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

    public function index()
    {
        $bienes = $this->bienService->obtenerBienes();

        return BienResource::collection($bienes);
    }
}
