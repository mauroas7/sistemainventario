<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EstadoMovimiento;

class EstadoMovimientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estadoMovimiento = [
            'Pendiente',
            'Recibido',
            'Cancelado',
            'Rechazado',
            'Finalizado',
        ];

        foreach($estadoMovimiento as $nombre) {
            EstadoMovimiento::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
