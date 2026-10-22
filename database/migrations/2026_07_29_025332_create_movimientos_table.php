<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bien_id')->constrained('bienes')->restrictOnDelete();
            $table->foreignId('creado_por')->constrained('users')->restrictOnDelete();
            // Quien dio el acuse de recibo, que es opcional.
            $table->foreignId('recibido_por')->nullable()->constrained('users')->nullOnDelete();
            // Quién tenía el bien a cargo al informar: no cambia si el bien se vuelve a mover.
            $table->foreignId('responsable_anterior_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('responsable_nuevo_id')->nullable()->constrained('users')->nullOnDelete();
            // Quién lo volcó a Diaguita.
            $table->foreignId('registrado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('area_origen_id')->constrained('areas')->restrictOnDelete();
            $table->foreignId('area_destino_id')->constrained('areas')->restrictOnDelete();
            $table->foreignId('tipo_movimiento_id')->constrained('tipos_movimiento')->restrictOnDelete();
            $table->foreignId('motivo_id')->constrained('motivos')->restrictOnDelete();
            $table->foreignId('estado_movimiento_id')->constrained('estados_movimiento')->restrictOnDelete();
            $table->text('observaciones_salida')->nullable();
            // Ruta de la foto opcional del bien al salir.
            $table->string('imagen_salida')->nullable();
            $table->dateTime('fecha_movimiento')->index();
            $table->dateTime('fecha_recepcion')->nullable();
            $table->dateTime('fecha_registro_diaguita')->nullable();
            // Ficha de inventario firmada: el trámite terminó.
            $table->dateTime('fecha_cierre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos');
    }
};
