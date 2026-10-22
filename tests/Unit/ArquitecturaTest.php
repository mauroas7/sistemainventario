<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Las reglas de capas del proyecto, verificadas en vez de recordadas.
 * No toca la base ni la red: lee los archivos de `app/` y busca importaciones.
 */
class ArquitecturaTest extends TestCase
{
    /**
     * Deuda ya existente al momento de escribir cada regla, por ruta relativa.
     * **Esta lista sólo puede achicarse**: si una regla falla por un archivo nuevo,
     * se corrige el archivo.
     *
     * @var array<string, array<int, string>>
     */
    private const PERDONADOS = [];

    public function test_los_controladores_no_hacen_entrada_salida_externa(): void
    {
        // `DB::transaction()` sí se permite: no es acceso a datos, es delimitar una escritura.
        $this->comprobar(
            'app/Http/Controllers',
            ['Http::', 'DB::table(', 'DB::connection(', 'DB::select(', 'DB::statement(', 'DB::raw('],
            'un controlador consulta datos o sale a la red por su cuenta; eso vive en un servicio',
        );
    }

    public function test_los_servicios_no_conocen_la_capa_de_entrada(): void
    {
        // Un servicio recibe datos ya validados: así se lo puede llamar desde la consola o el sembrado.
        $this->comprobar(
            'app/Services',
            ['use Illuminate\Http\Request;', 'use App\Http\Controllers'],
            'un servicio depende de la capa HTTP de entrada',
        );
    }

    public function test_los_modelos_no_dependen_de_las_capas_de_arriba(): void
    {
        $this->comprobar(
            'app/Models',
            ['use App\Http', 'use App\Services'],
            'un modelo depende de una capa que debería depender de él',
        );
    }

    /**
     * @param  array<int, string>  $prohibidos
     */
    private function comprobar(string $carpeta, array $prohibidos, string $porque): void
    {
        $infracciones = [];

        foreach ($this->archivosDe($carpeta) as $ruta => $contenido) {
            if (in_array($ruta, self::PERDONADOS[$carpeta] ?? [], true)) {
                continue;
            }

            foreach ($prohibidos as $prohibido) {
                if (str_contains($contenido, $prohibido)) {
                    $infracciones[] = "{$ruta} usa «{$prohibido}»";
                }
            }
        }

        $this->assertSame([], $infracciones, $porque."\n".implode("\n", $infracciones));
    }

    /** @return array<string, string> ruta relativa => contenido */
    private function archivosDe(string $carpeta): array
    {
        $raiz = dirname(__DIR__, 2);
        $base = $raiz.'/'.$carpeta;

        if (! is_dir($base)) {
            return [];
        }

        $archivos = [];
        $recorrido = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base));

        foreach ($recorrido as $archivo) {
            if ($archivo->isFile() && $archivo->getExtension() === 'php') {
                $ruta = str_replace('\\', '/', substr($archivo->getPathname(), strlen($raiz) + 1));
                $archivos[$ruta] = (string) file_get_contents($archivo->getPathname());
            }
        }

        return $archivos;
    }
}
