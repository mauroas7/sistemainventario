<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * El movimiento pasa a ser la declaración formal de un traslado que ya ocurrió,
     * y por lo tanto tiene que dejar constancia de la cadena de custodia:
     *
     * - `responsable_anterior_id`: quién tenía el bien a cargo en el momento de informar
     *   (snapshot; si después el bien se mueve otra vez, este registro no cambia).
     * - `responsable_nuevo_id`: a quién pasa el bien. Es el "desplegable de a quién se
     *   la lleva" que pidió Patrimonio y lo que define quién debe firmar la nueva ficha.
     *
     * Y el circuito administrativo de Patrimonio, que antes no existía:
     * - `fecha_registro_diaguita` / `registrado_por`: cuándo y quién lo volcó a Diaguita.
     * - `fecha_cierre`: cuándo se cerró el trámite (ficha firmada).
     */
    public function up(): void
    {
        Schema::table('movimientos', function (Blueprint $table) {
            $table->foreignId('responsable_anterior_id')
                ->nullable()
                ->after('recibido_por')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('responsable_nuevo_id')
                ->nullable()
                ->after('responsable_anterior_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('registrado_por')
                ->nullable()
                ->after('responsable_nuevo_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->dateTime('fecha_registro_diaguita')->nullable()->after('fecha_recepcion');
            $table->dateTime('fecha_cierre')->nullable()->after('fecha_registro_diaguita');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos', function (Blueprint $table) {
            $table->dropColumn(['fecha_cierre', 'fecha_registro_diaguita']);
            $table->dropConstrainedForeignId('registrado_por');
            $table->dropConstrainedForeignId('responsable_nuevo_id');
            $table->dropConstrainedForeignId('responsable_anterior_id');
        });
    }
};
