<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bien extends Model
{
    use HasFactory;

    protected $table = 'bienes';

    protected $fillable = [
        'codigo_patrimonial',
        'nombre',
        'categoria',
        'marca',
        'modelo',
        'estado',
        'ubicacion',
        'descripcion',
        'disponible',
    ];

    protected $casts = [
        'disponible' => 'boolean',
    ];
}
