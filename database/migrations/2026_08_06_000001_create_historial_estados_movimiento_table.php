<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bitácora de los cambios de estado de un movimiento.
 *
 * La tabla `movimientos` guarda solo el estado actual: si Patrimonio cierra un trámite
 * por error y lo vuelve atrás, no queda rastro de que pasó. Para un circuito que termina
 * en una ficha de inventario firmada hay que poder responder quién cambió qué y cuándo,
 * así que acá se anota cada transición.
 *
 * Es de solo agregar: nunca se actualiza ni se borra una fila. Por eso lleva únicamente
 * created_at y no el par de timestamps habitual.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_estados_movimiento', function (Blueprint $table) {
            $table->id();

            $table->foreignId('movimiento_id')
                ->constrained('movimientos')
                ->cascadeOnDelete();

            // Null en el alta: el movimiento no venía de ningún estado previo.
            $table->foreignId('estado_anterior_id')
                ->nullable()
                ->constrained('estados_movimiento')
                ->restrictOnDelete();

            $table->foreignId('estado_nuevo_id')
                ->constrained('estados_movimiento')
                ->restrictOnDelete();

            // Queda null si la cuenta que hizo el cambio se elimina: se pierde el quién,
            // pero no la transición, que es el dato patrimonial.
            $table->foreignId('usuario_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('created_at')->nullable();

            // Se consulta siempre como "historial de este movimiento, en orden".
            $table->index(['movimiento_id', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_estados_movimiento');
    }
};
