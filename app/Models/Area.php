<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    protected $table = 'areas';
    
    protected $fillable = [
        'nombre',
    ];

    /**
     * Usuarios pertenecientes al área.
     */
    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Bienes cuyo área responsable es esta área.
     */
    public function bienesResponsables(): HasMany
    {
        return $this->hasMany(
            Bien::class,
            'area_id'
        );
    }

    /**
     * Bienes ubicados actualmente en esta área.
     */
    public function bienesUbicados(): HasMany
    {
        return $this->hasMany(
            Bien::class,
            'ubicacion_actual_id'
        );
    }

    /**
     * Movimientos cuyo origen es esta área.
     */
    public function movimientosOrigen(): HasMany
    {
        return $this->hasMany(
            Movimiento::class,
            'area_origen_id'
        );
    }

    /**
     * Movimientos cuyo destino es esta área.
     */
    public function movimientosDestino(): HasMany
    {
        return $this->hasMany(
            Movimiento::class,
            'area_destino_id'
        );
    }
}
