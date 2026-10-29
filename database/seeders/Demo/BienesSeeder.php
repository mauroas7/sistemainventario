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
    /** Código, nombre, detalle, área, estado, quién lo tiene (puesto de `DemoSeeder`) y si está en Diaguita. */
    private const BIENES = [
        ['NB001', 'Notebook Dell Latitude 5420', 'Notebook utilizada por Sistemas.', 'Sistemas', 'Disponible', 'coordinador', true],
        ['NB002', 'Notebook Lenovo ThinkPad', 'Notebook de uso general.', 'Sistemas', 'Disponible', 'usuario1', true],
        ['SW001', 'Switch Cisco 24 puertos', 'Equipo de red.', 'Sistemas', 'Disponible', 'usuario2', false],
        ['MON001', 'Monitor Samsung 24"', 'Monitor LED Full HD.', 'Administración', 'En uso', 'usuario1', true],
        ['IMP001', 'Impresora HP LaserJet', 'Impresora láser.', 'Administración', 'En uso', 'usuario2', true],
        ['ESC001', 'Escritorio de melamina', 'Escritorio de dos cajones.', 'Administración', 'En uso', 'coordinador', true],
        ['PC001', 'PC de escritorio Dell OptiPlex', 'Puesto de liquidación de sueldos.', 'Recursos Humanos', 'En uso', 'usuario1', true],
        ['IMP002', 'Impresora multifunción Brother', 'Impresora con escáner.', 'Recursos Humanos', 'En uso', 'usuario2', false],
        ['TAL001', 'Taladro percutor Bosch', 'Herramienta del taller.', 'Mantenimiento', 'Disponible', 'usuario1', true],
        ['ESC002', 'Escalera de aluminio', 'Escalera de siete escalones.', 'Mantenimiento', 'Disponible', 'usuario2', true],
        ['TAB001', 'Tablet Samsung', 'Tablet institucional.', 'Enfermería', 'Disponible', 'usuario1', true],
        ['MPM001', 'Monitor multiparamétrico Mindray', 'Monitor de signos vitales.', 'Enfermería', 'En mantenimiento', 'usuario2', true],
        ['SRU001', 'Silla de ruedas', 'Silla de ruedas plegable.', 'Enfermería', 'Dañado', null, false],
        ['ECG001', 'Electrocardiógrafo', 'Equipo médico.', 'Laboratorio', 'En uso', 'usuario1', true],
        ['CEN001', 'Centrífuga de mesa', 'Centrífuga para tubos de ensayo.', 'Laboratorio', 'En uso', 'usuario2', true],
        ['MIC001', 'Microscopio binocular', 'Microscopio óptico.', 'Laboratorio', 'Disponible', 'coordinador', false],
        ['HEL001', 'Heladera para medicamentos', 'Heladera con control de temperatura.', 'Farmacia', 'En uso', 'usuario1', true],
        ['BAL001', 'Balanza digital', 'Balanza de precisión.', 'Farmacia', 'Disponible', 'usuario2', true],
        ['NB003', 'Notebook HP ProBook', 'Notebook de la Dirección.', 'Dirección', 'En uso', 'coordinador', true],
        ['PRO002', 'Proyector BenQ', 'Proyector de la sala de reuniones.', 'Dirección', 'Disponible', 'usuario1', true],
        ['PRO001', 'Proyector Epson', 'Proyector para capacitaciones.', 'Patrimonio', 'Disponible', 'admin1', true],
        ['CAM001', 'Cámara de fotos Canon', 'Cámara para relevar bienes.', 'Patrimonio', 'Prestado', 'admin2', true],
    ];

    public function run(): void
    {
        $areas = Area::pluck('id', 'nombre');
        $estados = EstadoBien::pluck('id', 'nombre');
        $diaguita = 950000;

        foreach (self::BIENES as [$codigo, $nombre, $descripcion, $area, $estado, $puesto, $enDiaguita]) {
            Bien::updateOrCreate(['codigo' => $codigo], [
                'numero_diaguita' => $enDiaguita ? (string) $diaguita++ : null,
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'area_id' => $areas[$area],
                'ubicacion_actual_id' => $areas[$area],
                'responsable_id' => $puesto ? User::where('email', DemoSeeder::correo($puesto, $area))->value('id') : null,
                'estado_id' => $estados[$estado],
            ]);
        }
    }
}
