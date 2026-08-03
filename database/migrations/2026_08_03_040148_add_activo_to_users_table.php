<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Las cuentas se dan de baja, no se borran.
     *
     * Un usuario que informó movimientos no se puede eliminar (la FK de
     * movimientos.creado_por es restrictOnDelete) y, aunque se pudiera, borrarlo
     * dejaría sin responsable a los bienes que tenía a cargo: justo la trazabilidad
     * que el sistema existe para conservar. Cuando alguien deja el hospital o cambia
     * de función, se desactiva: pierde el acceso y deja de aparecer como posible
     * responsable, pero todo su historial queda intacto.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('activo')->default(true)->after('rol');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('activo');
        });
    }
};
