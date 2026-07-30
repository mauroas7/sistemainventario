<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
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
            MovimientoSeeder::class,
        ]);
    }
}
