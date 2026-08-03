<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Carga inicial del sistema.
     *
     * Solo se siembran los catálogos y los datos maestros (áreas, estados, motivos,
     * usuarios y bienes). Los movimientos NO se siembran: son el registro histórico
     * de traslados reales y se generan informándolos desde el portal. Sembrarlos
     * inventaba historial patrimonial y dejaba a los bienes en ubicaciones que ningún
     * ticket explicaba.
     */
    public function run(): void
    {
        $this->call([
            AreaSeeder::class,
            EstadoBienSeeder::class,
            EstadoMovimientoSeeder::class,
            TipoMovimientoSeeder::class,
            MotivoSeeder::class,
            UserSeeder::class,
            BienSeeder::class,
        ]);
    }
}
