<?php

namespace Database\Seeders;

use Database\Seeders\Catalogos\ListasSeeder;
use Database\Seeders\Catalogos\SistemaSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Sólo `Catalogos/`, en todos los entornos. La demo (`Demo/DemoSeeder`)
     * se siembra a mano y en producción se niega a correr.
     */
    public function run(): void
    {
        $this->call([
            SistemaSeeder::class,
            ListasSeeder::class,
        ]);
    }
}
