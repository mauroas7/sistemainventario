<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class InicioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inicio/Index');
    }
}
