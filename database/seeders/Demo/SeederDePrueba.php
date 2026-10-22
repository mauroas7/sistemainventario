<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use RuntimeException;

/** La base de los seeders de `Demo/`: en producción no corren, ni pedidos uno por uno. */
abstract class SeederDePrueba extends Seeder
{
    public function __invoke(array $parameters = [])
    {
        if (app()->isProduction()) {
            throw new RuntimeException(class_basename(static::class).' es de prueba: en producción no se siembra.');
        }

        return parent::__invoke($parameters);
    }
}
