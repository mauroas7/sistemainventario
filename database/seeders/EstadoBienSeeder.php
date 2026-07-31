<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EstadoBien;

class EstadoBienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estadoBien = [
            'Disponible',
            'En uso',
            'Prestado',
            'En mantenimiento',
            'Dañado',
            'Baja',
        ];

        foreach($estadoBien as $nombre) {
            EstadoBien::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
