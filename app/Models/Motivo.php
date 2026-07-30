<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Motivo extends Model
{
    protected $table = 'motivos';
    protected $fillable = [
        'nombre',
    ];

    public function movimientos(): HasMany
    {
        return $this->hasMany(Movimiento::class);
    }
}
