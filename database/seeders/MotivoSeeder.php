<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Motivo;

class MotivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $motivo = [
            'Cambio de área',
            'Préstamo',
            'Evento',
            'Mantenimiento',
            'Reparación',
            'Devolución',
            'Inventario',
            'Daño',
            'Otro',
        ];

        foreach ($motivo as $nombre) {
            Motivo::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
