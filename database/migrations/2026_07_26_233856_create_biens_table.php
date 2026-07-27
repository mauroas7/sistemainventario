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
            $table->string('codigo_patrimonial')->unique();
            $table->string('nombre');
            $table->string('categoria');
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->string('estado')->default('Disponible');
            $table->string('ubicacion')->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bienes');
    }
};
