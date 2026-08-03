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
        // El movimiento es la declaración de un traslado que ya ocurrió; estos estados
        // siguen el trámite administrativo de Patrimonio, no una negociación entre áreas.
        $estadoMovimiento = [
            'Informado',   // el responsable avisó; falta volcarlo a Diaguita
            'Registrado',  // ya cargado en Diaguita; falta la firma de la ficha
            'Cerrado',     // ficha firmada, trámite terminado
            'Anulado',     // se informó por error
        ];

        // firstOrCreate y no create: la migración que replanteó los estados ya los deja
        // creados en una base nueva, así que el seeder tiene que poder correr encima.
        foreach($estadoMovimiento as $nombre) {
            EstadoMovimiento::firstOrCreate([
                'nombre' => $nombre,
            ]);
        }
    }
}
