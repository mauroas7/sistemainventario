<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Movimiento extends Model
{
    protected $table = 'movimientos';
    
    protected $fillable = [
        'bien_id',
        'creado_por',
        'recibido_por',
        'area_origen_id',
        'area_destino_id',
        'tipo_movimiento_id',
        'motivo_id',
        'estado_movimiento_id',
        'condicion_al_salir',
        'condicion_al_recibir',
        'observaciones_salida',
        'observaciones_recepcion',
        'fecha_movimiento',
        'fecha_recepcion',
    ];

    protected function casts(): array
    {
        return [
            'fecha_movimiento' => 'datetime',
            'fecha_recepcion' => 'datetime',
        ];
    }

    /**
     * Bien involucrado en el movimiento.
     */
    public function bien(): BelongsTo
    {
        return $this->belongsTo(Bien::class);
    }

    /**
     * Usuario que creó el movimiento.
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'creado_por'
        );
    }

    /**
     * Usuario que recibió el bien.
     */
    public function receptor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'recibido_por'
        );
    }

    /**
     * Área desde donde sale el bien.
     */
    public function areaOrigen(): BelongsTo
    {
        return $this->belongsTo(
            Area::class,
            'area_origen_id'
        );
    }

    /**
     * Área hacia donde se dirige el bien.
     */
    public function areaDestino(): BelongsTo
    {
        return $this->belongsTo(
            Area::class,
            'area_destino_id'
        );
    }

    /**
     * Tipo de movimiento.
     */
    public function tipoMovimiento(): BelongsTo
    {
        return $this->belongsTo(
            TipoMovimiento::class,
            'tipo_movimiento_id'
        );
    }

    /**
     * Motivo del movimiento.
     */
    public function motivo(): BelongsTo
    {
        return $this->belongsTo(
            Motivo::class,
            'motivo_id'
        );
    }

    /**
     * Estado actual del movimiento.
     */
    public function estadoMovimiento(): BelongsTo
    {
        return $this->belongsTo(
            EstadoMovimiento::class,
            'estado_movimiento_id'
        );
    }
}
