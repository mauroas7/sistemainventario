<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;
use App\Models\User;

class BienSeeder extends Seeder
{
    /**
     * Inventario inicial.
     *
     * Todos los bienes arrancan en su área, sin movimientos previos: la ubicación
     * actual coincide con el área responsable porque todavía no hubo ningún traslado
     * que explique una diferencia. A partir de acá, cualquier cambio de ubicación o
     * de responsable tiene que venir de un movimiento informado desde el portal.
     */
    public function run(): void
    {
        $areas = Area::pluck('id', 'nombre');
        $estados = EstadoBien::pluck('id', 'nombre');

        // Responsable por defecto: el usuario del área a la que pertenece el bien.
        $responsablePorArea = User::query()
            ->whereNotNull('area_id')
            ->get()
            ->keyBy('area_id');

        $bienes = [

            [
                'codigo' => 'NB001',
                'nombre' => 'Notebook Dell Latitude 5420',
                'descripcion' => 'Notebook utilizada por Sistemas.',
                'area' => 'Sistemas',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'NB002',
                'nombre' => 'Notebook Lenovo ThinkPad',
                'descripcion' => 'Notebook de uso general.',
                'area' => 'Sistemas',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'MON001',
                'nombre' => 'Monitor Samsung 24"',
                'descripcion' => 'Monitor LED Full HD.',
                'area' => 'Administración',
                'estado' => 'En uso',
            ],

            [
                'codigo' => 'IMP001',
                'nombre' => 'Impresora HP LaserJet',
                'descripcion' => 'Impresora láser.',
                'area' => 'Administración',
                'estado' => 'En uso',
            ],

            [
                'codigo' => 'PRO001',
                'nombre' => 'Proyector Epson',
                'descripcion' => 'Proyector para capacitaciones.',
                'area' => 'Patrimonio',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'TAB001',
                'nombre' => 'Tablet Samsung',
                'descripcion' => 'Tablet institucional.',
                'area' => 'Enfermería',
                'estado' => 'Disponible',
            ],

            [
                'codigo' => 'ECG001',
                'nombre' => 'Electrocardiógrafo',
                'descripcion' => 'Equipo médico.',
                'area' => 'Laboratorio',
                'estado' => 'En uso',
            ],

            [
                'codigo' => 'SW001',
                'nombre' => 'Switch Cisco 24 puertos',
                'descripcion' => 'Equipo de red.',
                'area' => 'Sistemas',
                'estado' => 'Disponible',
            ],

        ];

        foreach ($bienes as $indice => $bien) {

            $areaId = $areas[$bien['area']];

            Bien::create([
                // Número interno del Excel de Patrimonio.
                'codigo' => $bien['codigo'],

                // Número de Diaguita: único para toda la UNCuyo, ronda el 950.000.
                // Los dos últimos quedan sin número a propósito, para representar los
                // ~2.000 bienes del hospital que todavía no están cargados en Diaguita.
                'numero_diaguita' => $indice < 6 ? (string) (950000 + $indice) : null,

                'nombre' => $bien['nombre'],
                'descripcion' => $bien['descripcion'],

                'area_id' => $areaId,
                'ubicacion_actual_id' => $areaId,
                'responsable_id' => $responsablePorArea->get($areaId)?->id,
                'estado_id' => $estados[$bien['estado']],
            ]);
        }
    }
}
