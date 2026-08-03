<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Los estados anteriores (Pendiente / Recibido / Cancelado / Rechazado / Finalizado)
     * modelaban un traslado que el área destino tenía que aceptar. El circuito real es
     * otro: el responsable *informa* un movimiento que ya ocurrió, y quien lo tramita
     * después es Patrimonio, volcándolo a Diaguita y haciendo firmar la ficha.
     *
     * Los nuevos estados siguen ese trámite, no una negociación entre áreas:
     *   Informado  -> el responsable avisó; Patrimonio todavía no lo cargó en Diaguita.
     *   Registrado -> Patrimonio ya lo volcó a Diaguita; falta la firma de la ficha.
     *   Cerrado    -> ficha firmada, trámite terminado.
     *   Anulado    -> se informó por error.
     */
    private const MAPEO = [
        'Pendiente' => 'Informado',
        'Recibido' => 'Registrado',
        'Finalizado' => 'Cerrado',
        'Cancelado' => 'Anulado',
        'Rechazado' => 'Anulado',
    ];

    private const NUEVOS = ['Informado', 'Registrado', 'Cerrado', 'Anulado'];

    public function up(): void
    {
        DB::transaction(function () {
            // 1. Creamos los estados nuevos que todavía no existan.
            foreach (self::NUEVOS as $nombre) {
                DB::table('estados_movimiento')->insertOrIgnore([
                    'nombre' => $nombre,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $idsPorNombre = DB::table('estados_movimiento')->pluck('id', 'nombre');

            // 2. Reapuntamos los movimientos existentes al estado equivalente.
            foreach (self::MAPEO as $viejo => $nuevo) {
                $idViejo = $idsPorNombre[$viejo] ?? null;
                $idNuevo = $idsPorNombre[$nuevo] ?? null;

                if (! $idViejo || ! $idNuevo || $idViejo === $idNuevo) {
                    continue;
                }

                DB::table('movimientos')
                    ->where('estado_movimiento_id', $idViejo)
                    ->update(['estado_movimiento_id' => $idNuevo]);
            }

            // 3. Borramos los estados viejos ya sin uso.
            DB::table('estados_movimiento')
                ->whereIn('nombre', array_keys(self::MAPEO))
                ->whereNotIn('nombre', self::NUEVOS)
                ->delete();
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            foreach (array_keys(self::MAPEO) as $nombre) {
                DB::table('estados_movimiento')->insertOrIgnore([
                    'nombre' => $nombre,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $idsPorNombre = DB::table('estados_movimiento')->pluck('id', 'nombre');

            // Volvemos al estado más representativo de cada uno (la vuelta atrás no es
            // exacta: Cancelado y Rechazado se habían unificado en Anulado).
            $inverso = ['Informado' => 'Pendiente', 'Registrado' => 'Recibido', 'Cerrado' => 'Finalizado', 'Anulado' => 'Cancelado'];

            foreach ($inverso as $nuevo => $viejo) {
                $idNuevo = $idsPorNombre[$nuevo] ?? null;
                $idViejo = $idsPorNombre[$viejo] ?? null;

                if (! $idViejo || ! $idNuevo || $idViejo === $idNuevo) {
                    continue;
                }

                DB::table('movimientos')
                    ->where('estado_movimiento_id', $idNuevo)
                    ->update(['estado_movimiento_id' => $idViejo]);
            }

            DB::table('estados_movimiento')->whereIn('nombre', self::NUEVOS)->delete();
        });
    }
};
