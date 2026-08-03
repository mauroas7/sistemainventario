<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Patrimonio lleva dos numeraciones en paralelo y las necesita cruzadas:
     * el número interno del Excel que arranca en 2010 (columna `codigo`, ya existente)
     * y el número de Diaguita, que es único para toda la UNCuyo y ronda el 950.000.
     *
     * `numero_diaguita` es nullable a propósito: cerca de 2.000 bienes del hospital
     * todavía no están cargados en Diaguita y el sistema tiene que representarlos igual.
     *
     * Además, la responsabilidad patrimonial es de una persona (la que firma la ficha
     * de inventario), no de un área: hasta ahora el bien solo apuntaba a un área, lo
     * que hacía imposible decir "este bien es tu responsabilidad".
     */
    public function up(): void
    {
        Schema::table('bienes', function (Blueprint $table) {
            $table->string('numero_diaguita')->nullable()->unique()->after('codigo');

            $table->foreignId('responsable_id')
                ->nullable()
                ->after('ubicacion_actual_id')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bienes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('responsable_id');
            $table->dropUnique(['numero_diaguita']);
            $table->dropColumn('numero_diaguita');
        });
    }
};
