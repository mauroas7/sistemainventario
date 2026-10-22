<?php

namespace Database\Seeders\Demo;

use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;
use App\Models\User;

/**
 * Los bienes arrancan en su área, sin movimientos: cualquier cambio de ubicación
 * o de responsable tiene que venir de un movimiento informado.
 */
class BienesSeeder extends SeederDePrueba
{
    public function run(): void
    {
        $areas = Area::pluck('id', 'nombre');
        $estados = EstadoBien::pluck('id', 'nombre');
        $responsablePorArea = User::whereNotNull('area_id')->get()->keyBy('area_id');

        $bienes = [
            ['NB001', 'Notebook Dell Latitude 5420', 'Notebook utilizada por Sistemas.', 'Sistemas', 'Disponible'],
            ['NB002', 'Notebook Lenovo ThinkPad', 'Notebook de uso general.', 'Sistemas', 'Disponible'],
            ['MON001', 'Monitor Samsung 24"', 'Monitor LED Full HD.', 'Administración', 'En uso'],
            ['IMP001', 'Impresora HP LaserJet', 'Impresora láser.', 'Administración', 'En uso'],
            ['PRO001', 'Proyector Epson', 'Proyector para capacitaciones.', 'Patrimonio', 'Disponible'],
            ['TAB001', 'Tablet Samsung', 'Tablet institucional.', 'Enfermería', 'Disponible'],
            ['ECG001', 'Electrocardiógrafo', 'Equipo médico.', 'Laboratorio', 'En uso'],
            ['SW001', 'Switch Cisco 24 puertos', 'Equipo de red.', 'Sistemas', 'Disponible'],
        ];

        foreach ($bienes as $indice => [$codigo, $nombre, $descripcion, $area, $estado]) {
            $areaId = $areas[$area];

            Bien::updateOrCreate(['codigo' => $codigo], [
                // Los dos últimos, sin número: son los bienes que todavía no están en Diaguita.
                'numero_diaguita' => $indice < 6 ? (string) (950000 + $indice) : null,
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'area_id' => $areaId,
                'ubicacion_actual_id' => $areaId,
                'responsable_id' => $responsablePorArea->get($areaId)?->id,
                'estado_id' => $estados[$estado],
            ]);
        }
    }
}
