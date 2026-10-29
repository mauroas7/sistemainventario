<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Bien extends Model
{
    protected $table = 'bienes';

    protected $fillable = [
        'codigo',
        'numero_diaguita',
        'nombre',
        'descripcion',
        'area_id',
        'ubicacion_actual_id',
        'responsable_id',
        'estado_id',
    ];

    /**
     * Área responsable del bien.
     */
    public function area(): BelongsTo
    {
        return $this->belongsTo(
            Area::class,
            'area_id'
        );
    }

    /**
     * Área donde se encuentra actualmente el bien.
     */
    public function ubicacionActual(): BelongsTo
    {
        return $this->belongsTo(
            Area::class,
            'ubicacion_actual_id'
        );
    }

    /**
     * Persona que tiene el bien a cargo y firma la ficha de inventario.
     */
    public function responsable(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'responsable_id'
        );
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(
            EstadoBien::class,
            'estado_id'
        );
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(Movimiento::class);
    }

    /** El movimiento más reciente, anulado o no: el mismo orden que la ficha del bien. */
    public function ultimoMovimiento(): HasOne
    {
        return $this->hasOne(Movimiento::class)->ofMany(['fecha_movimiento' => 'max', 'id' => 'max']);
    }
}
