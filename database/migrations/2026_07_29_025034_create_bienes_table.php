<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bienes', function (Blueprint $table) {
            $table->id();
            // Número de inventario interno del hospital.
            $table->string('codigo')->unique();
            // Nullable: hay bienes del hospital que todavía no están cargados en Diaguita.
            $table->string('numero_diaguita')->nullable()->unique();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->foreignId('area_id')->constrained('areas')->restrictOnDelete();
            $table->foreignId('ubicacion_actual_id')->constrained('areas')->restrictOnDelete();
            // Quien firma la ficha de inventario. Null mientras Patrimonio no lo defina.
            $table->foreignId('responsable_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('estado_id')->constrained('estados_bien')->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bienes');
    }
};
