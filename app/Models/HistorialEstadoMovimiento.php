<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Una transición de estado de un movimiento. Ver la migración para el porqué.
 *
 * Es de solo agregar: no se actualiza ni se borra. Por eso no maneja updated_at.
 */
class HistorialEstadoMovimiento extends Model
{
    protected $table = 'historial_estados_movimiento';

    public const UPDATED_AT = null;

    protected $fillable = [
        'movimiento_id',
        'estado_anterior_id',
        'estado_nuevo_id',
        'usuario_id',
    ];

    public function movimiento(): BelongsTo
    {
        return $this->belongsTo(Movimiento::class);
    }

    public function estadoAnterior(): BelongsTo
    {
        return $this->belongsTo(EstadoMovimiento::class, 'estado_anterior_id');
    }

    public function estadoNuevo(): BelongsTo
    {
        return $this->belongsTo(EstadoMovimiento::class, 'estado_nuevo_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
