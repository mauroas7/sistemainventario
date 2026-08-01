<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\MotivoResource;
use App\Services\MotivoService;

class MotivoController extends Controller
{
    public function __construct(
        private MotivoService $motivoService
    ) {}

    public function index()
    {
        $motivo = $this->motivoService->obtenerMotivos();

        return MotivoResource::collection($motivo);
    }
}
