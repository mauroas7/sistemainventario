<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoMovimiento extends Model
{
    protected $table = 'tipos_movimiento';

    protected $fillable = [
        'nombre',
    ];

    public function movimientos(): HasMany
    {
        return $this->hasMany(Movimiento::class);
    }
}
