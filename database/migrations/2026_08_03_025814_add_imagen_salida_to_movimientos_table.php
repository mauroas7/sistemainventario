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
        Schema::table('movimientos', function (Blueprint $table) {
            // Ruta (disco "public") de la foto adjuntada al crear el ticket, documentando
            // el estado del bien al salir. Opcional.
            $table->string('imagen_salida')->nullable()->after('observaciones_salida');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos', function (Blueprint $table) {
            $table->dropColumn('imagen_salida');
        });
    }
};
