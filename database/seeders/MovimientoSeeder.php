<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoMovimiento;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;

class MovimientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = Area::pluck('id', 'nombre');
        $usuarios = User::pluck('id', 'name');
        $bienes = Bien::pluck('id', 'codigo');

        $tipos = TipoMovimiento::pluck('id', 'nombre');
        $motivos = Motivo::pluck('id', 'nombre');
        $estados = EstadoMovimiento::pluck('id', 'nombre');

        $movimientos = [

            [
                'bien' => 'NB002',

                'creador' => 'Juan Pérez',
                'receptor' => 'Carlos Ruiz',

                'origen' => 'Sistemas',
                'destino' => 'Laboratorio',

                'tipo' => 'Préstamo',
                'motivo' => 'Préstamo',
                'estado' => 'Pendiente',

                'condicion_salida' => 'Excelente',

                'condicion_recepcion' => null,

                'obs_salida' => 'Equipo entregado con cargador.',

                'obs_recepcion' => null,

                'fecha_movimiento' => now()->subDays(2),

                'fecha_recepcion' => null,
            ],

            [
                'bien' => 'MON001',

                'creador' => 'María López',
                'receptor' => 'Administrador',

                'origen' => 'Administración',
                'destino' => 'Dirección',

                'tipo' => 'Transferencia',
                'motivo' => 'Cambio de área',
                'estado' => 'Recibido',

                'condicion_salida' => 'Buen estado',

                'condicion_recepcion' => 'Buen estado',

                'obs_salida' => 'Sin observaciones.',

                'obs_recepcion' => 'Recibido correctamente.',

                'fecha_movimiento' => now()->subDays(10),

                'fecha_recepcion' => now()->subDays(9),
            ],

            [
                'bien' => 'PRO001',

                'creador' => 'Administrador',

                'receptor' => null,

                'origen' => 'Patrimonio',
                'destino' => 'Patrimonio',

                'tipo' => 'Retiro personal',
                'motivo' => 'Evento',
                'estado' => 'Finalizado',

                'condicion_salida' => 'Excelente',

                'condicion_recepcion' => null,

                'obs_salida' => 'Retirado para capacitación.',

                'obs_recepcion' => null,

                'fecha_movimiento' => now()->subDays(15),

                'fecha_recepcion' => null,
            ],

            [
                'bien' => 'IMP001',

                'creador' => 'María López',

                'receptor' => null,

                'origen' => 'Administración',
                'destino' => 'Mantenimiento',

                'tipo' => 'Mantenimiento',
                'motivo' => 'Mantenimiento',
                'estado' => 'Pendiente',

                'condicion_salida' => 'No imprime correctamente.',

                'condicion_recepcion' => null,

                'obs_salida' => 'Revisión técnica.',

                'obs_recepcion' => null,

                'fecha_movimiento' => now()->subDay(),

                'fecha_recepcion' => null,
            ],

        ];

        foreach ($movimientos as $movimiento) {

            Movimiento::create([

                'bien_id' => $bienes[$movimiento['bien']],

                'creado_por' => $usuarios[$movimiento['creador']],

                'recibido_por' => $movimiento['receptor']
                    ? $usuarios[$movimiento['receptor']]
                    : null,

                'area_origen_id' => $areas[$movimiento['origen']],

                'area_destino_id' => $areas[$movimiento['destino']],

                'tipo_movimiento_id' => $tipos[$movimiento['tipo']],

                'motivo_id' => $motivos[$movimiento['motivo']],

                'estado_movimiento_id' => $estados[$movimiento['estado']],

                'condicion_al_salir' => $movimiento['condicion_salida'],

                'condicion_al_recibir' => $movimiento['condicion_recepcion'],

                'observaciones_salida' => $movimiento['obs_salida'],

                'observaciones_recepcion' => $movimiento['obs_recepcion'],

                'fecha_movimiento' => $movimiento['fecha_movimiento'],

                'fecha_recepcion' => $movimiento['fecha_recepcion'],
            ]);
        }
    }
}
