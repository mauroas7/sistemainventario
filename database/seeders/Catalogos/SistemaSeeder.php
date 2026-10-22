<?php

namespace Database\Seeders\Catalogos;

use App\Models\EstadoMovimiento;
use Illuminate\Database\Seeder;

/**
 * Las filas que la aplicación compara por su nombre. Sin ellas no funciona,
 * tampoco en producción, y renombrar una acá rompe el trámite sin avisar.
 */
class SistemaSeeder extends Seeder
{
    public function run(): void
    {
        // El trámite de Patrimonio sobre un traslado que ya ocurrió.
        foreach (['Informado', 'Registrado', 'Cerrado', 'Anulado'] as $nombre) {
            EstadoMovimiento::firstOrCreate(['nombre' => $nombre]);
        }
    }
}
