<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoMovimiento;

class TipoMovimientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipoMovimiento = [
            'Transferencia',
            'Préstamo',
            'Retiro personal',
            'Devolución',
            'Mantenimiento',
            'Baja',
        ];

        foreach($tipoMovimiento as $nombre) {
            TipoMovimiento::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
