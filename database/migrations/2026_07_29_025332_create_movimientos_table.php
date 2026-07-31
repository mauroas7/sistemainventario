<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movimientos', function (Blueprint $table) {
            $table->id();

            // Bien que se está moviendo
            $table->foreignId('bien_id')
                ->constrained('bienes')
                ->restrictOnDelete();

            // Usuario que registra el movimiento
            $table->foreignId('creado_por')
                ->constrained('users')
                ->restrictOnDelete();

            // Usuario que recibe el bien
            // Puede ser NULL para movimientos sin receptor
            $table->foreignId('recibido_por')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Área desde la que sale el bien
            $table->foreignId('area_origen_id')
                ->constrained('areas')
                ->restrictOnDelete();

            // Área a la que se dirige el bien
            $table->foreignId('area_destino_id')
                ->constrained('areas')
                ->restrictOnDelete();

            // Tipo de movimiento
            $table->foreignId('tipo_movimiento_id')
                ->constrained('tipos_movimiento')
                ->restrictOnDelete();

            // Motivo del movimiento
            $table->foreignId('motivo_id')
                ->constrained('motivos')
                ->restrictOnDelete();

            // Estado actual del movimiento
            $table->foreignId('estado_movimiento_id')
                ->constrained('estados_movimiento')
                ->restrictOnDelete();

            // Condición física del bien al salir
            $table->string('condicion_al_salir')->nullable();

            // Condición física del bien al recibir
            $table->string('condicion_al_recibir')->nullable();

            // Observaciones realizadas al enviar
            $table->text('observaciones_salida')->nullable();

            // Observaciones realizadas al recibir
            $table->text('observaciones_recepcion')->nullable();

            // Fecha en la que se registra el movimiento
            $table->dateTime('fecha_movimiento');

            // Fecha en la que se recibe el bien
            $table->dateTime('fecha_recepcion')->nullable();

            $table->timestamps();

            // Índices adicionales para filtros frecuentes
            $table->index('fecha_movimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos');
    }
};
