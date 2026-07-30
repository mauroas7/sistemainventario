<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;

class BienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = Area::pluck('id', 'nombre');
        $estados = EstadoBien::pluck('id', 'nombre');

        $bienes = [

            [
                'codigo' => 'NB001',
                'nombre' => 'Notebook Dell Latitude 5420',
                'descripcion' => 'Notebook utilizada por Sistemas.',
                'area' => 'Sistemas',
                'ubicacion' => 'Sistemas',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'NB002',
                'nombre' => 'Notebook Lenovo ThinkPad',
                'descripcion' => 'Notebook asignada a Laboratorio.',
                'area' => 'Sistemas',
                'ubicacion' => 'Laboratorio',
                'estado' => 'Prestado',
            ],

            [
                'codigo' => 'MON001',
                'nombre' => 'Monitor Samsung 24"',
                'descripcion' => 'Monitor LED Full HD.',
                'area' => 'Administración',
                'ubicacion' => 'Dirección',
                'estado' => 'En uso',
            ],

            [
                'codigo' => 'IMP001',
                'nombre' => 'Impresora HP LaserJet',
                'descripcion' => 'Impresora láser.',
                'area' => 'Administración',
                'ubicacion' => 'Administración',
                'estado' => 'En mantenimiento',
            ],

            [
                'codigo' => 'PRO001',
                'nombre' => 'Proyector Epson',
                'descripcion' => 'Proyector para capacitaciones.',
                'area' => 'Patrimonio',
                'ubicacion' => 'Patrimonio',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'TAB001',
                'nombre' => 'Tablet Samsung',
                'descripcion' => 'Tablet institucional.',
                'area' => 'Enfermería',
                'ubicacion' => 'Enfermería',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'ECG001',
                'nombre' => 'Electrocardiógrafo',
                'descripcion' => 'Equipo médico.',
                'area' => 'Laboratorio',
                'ubicacion' => 'Laboratorio',
                'estado' => 'En uso',
            ],

            [
                'codigo' => 'SW001',
                'nombre' => 'Switch Cisco 24 puertos',
                'descripcion' => 'Equipo de red.',
                'area' => 'Sistemas',
                'ubicacion' => 'Sistemas',
                'estado' => 'Disponible',
            ],

        ];

        foreach ($bienes as $bien) {

            Bien::create([
                'codigo' => $bien['codigo'],
                'nombre' => $bien['nombre'],
                'descripcion' => $bien['descripcion'],

                'area_id' => $areas[$bien['area']],
                'ubicacion_actual_id' => $areas[$bien['ubicacion']],
                'estado_id' => $estados[$bien['estado']],
            ]);
        }
    }
}
