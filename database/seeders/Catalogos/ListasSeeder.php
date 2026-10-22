<?php

namespace Database\Seeders\Catalogos;

use App\Models\EstadoBien;
use App\Models\Motivo;
use App\Models\TipoMovimiento;
use Illuminate\Database\Seeder;

/** Las opciones de los desplegables del traslado. No hay pantalla para cargarlas. */
class ListasSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Disponible', 'En uso', 'Prestado', 'En mantenimiento', 'Dañado', 'Baja'] as $nombre) {
            EstadoBien::firstOrCreate(['nombre' => $nombre]);
        }

        foreach (['Transferencia', 'Préstamo', 'Retiro personal', 'Devolución', 'Mantenimiento', 'Baja'] as $nombre) {
            TipoMovimiento::firstOrCreate(['nombre' => $nombre]);
        }

        $motivos = [
            'Cambio de área', 'Préstamo', 'Evento', 'Mantenimiento', 'Reparación',
            'Devolución', 'Inventario', 'Daño', 'Otro',
        ];

        foreach ($motivos as $nombre) {
            Motivo::firstOrCreate(['nombre' => $nombre]);
        }
    }
}
