<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            'Dirección',
            'Administración',
            'Recursos Humanos',
            'Mantenimiento',
            'Enfermería',
            'Laboratorio',
            'Farmacia',
            'Sistemas',
            'Patrimonio',
        ];

        foreach ($areas as $nombre) {
            Area::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
