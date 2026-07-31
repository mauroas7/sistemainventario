<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoBien extends Model
{
    protected $table = 'estados_bien';

    protected $fillable = [
        'nombre',
    ];

    /**
     * Bienes que tienen este estado.
     */
    public function bienes(): HasMany
    {
        return $this->hasMany(Bien::class, 'estado_id');
    }
}
