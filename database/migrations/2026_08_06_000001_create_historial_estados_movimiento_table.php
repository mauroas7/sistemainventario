<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bitácora de los cambios de estado de un movimiento: quién cambió qué y cuándo.
 * Sólo se agregan filas, nunca se editan; por eso lleva `created_at` y no `updated_at`.
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
