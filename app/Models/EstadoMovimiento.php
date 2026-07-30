<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoMovimiento extends Model
{
    protected $table = 'estados_movimiento';

    protected $fillable = [
        'nombre',
    ];

    public function movimientos(): HasMany
    {
        return $this->hasMany(Movimiento::class);
    }
}
