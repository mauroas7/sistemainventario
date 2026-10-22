<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * La regla de comentarios de `docs/comentarios.md`, verificada.
 *
 * Un comentario describe el código que está ahí, en presente, y entra en 4
 * líneas de prosa. Lo que no entra no va en el archivo: va en el documento
 * de la zona, en `docs/`, donde se lee entero y no se duplica.
 */
class ComentariosTest extends TestCase
{
    private const LIMITE_LINEAS = 4;

    /** @var array<int, string> */
    private const CARPETAS = ['app', 'routes', 'database', 'resources/js', 'tests'];

    /** @var array<int, string> */
    private const EXTENSIONES = ['php', 'js', 'jsx'];

    /**
     * Banners: no dicen nada y envejecen mal cuando el bloque que rotulan se
     * parte en dos.
     *
     * @var array<string, string>
     */
    private const BANNERS = [
        'regla de iguales' => '#^\s*(//|\*|/\*)\s*={3,}#',
        'regla de barras' => '#^\s*/{4,}#',
        'regla de guiones' => '#^\s*(//|\*)\s*[-─—_]{6,}#',
        'título numerado' => '#^\s*//\s*\d+[.)]\s*\S#',
    ];

    public function test_ningun_comentario_pasa_de_cuatro_lineas_de_prosa(): void
    {
        $largos = [];

        foreach ($this->comentarios() as [$ruta, $linea, $prosa, $crudo]) {
            if (count($prosa) > self::LIMITE_LINEAS) {
                $largos[] = "{$ruta}:{$linea} tiene ".count($prosa).' líneas de prosa';
            }
        }

        $this->assertSame([], $largos, "Comentarios pasados de 4 líneas de prosa.\n"
            ."Si el porqué no entra, va en el documento de la zona en docs/ y el código enlaza.\n"
            .implode("\n", $largos));
    }

    public function test_no_hay_banners(): void
    {
        $encontrados = [];

        foreach ($this->comentarios() as [$ruta, $linea, $prosa, $crudo]) {
            foreach (self::BANNERS as $nombre => $patron) {
                foreach ($crudo as $texto) {
                    if (preg_match($patron, $texto)) {
                        $encontrados[] = "{$ruta}:{$linea} usa un banner ({$nombre})";

                        continue 3;
                    }
                }
            }
        }

        $this->assertSame([], $encontrados, "Banners: no dicen nada.\n".implode("\n", $encontrados));
    }

    /**
     * Recorre las carpetas del proyecto y devuelve un comentario por entrada.
     *
     * @return array<int, array{0: string, 1: int, 2: array<int, string>, 3: array<int, string>}>
     *                                                                                            ruta, línea de inicio, prosa, líneas crudas
     */
    private function comentarios(): array
    {
        $encontrados = [];

        foreach ($this->archivos() as $ruta => $contenido) {
            foreach ($this->comentariosDe($contenido) as [$linea, $crudo]) {
                $encontrados[] = [$ruta, $linea, $this->prosaDe($crudo), $crudo];
            }
        }

        return $encontrados;
    }

    /**
     * Un docblock partido en párrafos es un solo comentario. Entre comentarios
     * de línea, una línea de código o un renglón en blanco cierran el bloque.
     *
     * @return array<int, array{0: int, 1: array<int, string>}>
     */
    private function comentariosDe(string $contenido): array
    {
        $comentarios = [];
        $bloque = [];
        $inicio = 0;
        $dentroDeBloque = false;

        $cerrar = function () use (&$comentarios, &$bloque, &$inicio) {
            if ($bloque !== []) {
                $comentarios[] = [$inicio, $bloque];
            }

            $bloque = [];
        };

        foreach (explode("\n", $contenido) as $numero => $cruda) {
            $linea = trim($cruda);

            if ($dentroDeBloque) {
                $bloque[] = $cruda;

                if (str_contains($linea, '*/')) {
                    $dentroDeBloque = false;
                    $cerrar();
                }

                continue;
            }

            // En JSX el bloque viaja envuelto: `{/* … */}`.
            if (preg_match('#^\{?/\*#', $linea)) {
                $cerrar();
                $inicio = $numero + 1;
                $bloque[] = $cruda;
                $dentroDeBloque = ! preg_match('#\*/#', substr($linea, 2));

                if (! $dentroDeBloque) {
                    $cerrar();
                }

                continue;
            }

            if (str_starts_with($linea, '//')) {
                if ($bloque === []) {
                    $inicio = $numero + 1;
                }

                $bloque[] = $cruda;

                continue;
            }

            $cerrar();
        }

        $cerrar();

        return $comentarios;
    }

    /**
     * La prosa del comentario: sin delimitadores, sin renglones vacíos y sin
     * anotaciones, que no son prosa y no suman al límite.
     *
     * @param  array<int, string>  $crudo
     * @return array<int, string>
     */
    private function prosaDe(array $crudo): array
    {
        $prosa = [];

        foreach ($crudo as $linea) {
            $texto = trim(preg_replace('#^\s*(\{?/\*+|\*+/\}?|\*+/|\*|//)\s?#', '', $linea));
            $texto = trim(preg_replace('#\*/\}?$#', '', $texto));

            if ($texto === '' || str_starts_with($texto, '@')) {
                continue;
            }

            $prosa[] = $texto;
        }

        return $prosa;
    }

    /** @return array<string, string> ruta relativa => contenido */
    private function archivos(): array
    {
        $raiz = dirname(__DIR__, 2);
        $archivos = [];

        foreach (self::CARPETAS as $carpeta) {
            $base = $raiz.'/'.$carpeta;

            if (! is_dir($base)) {
                continue;
            }

            $recorrido = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base));

            foreach ($recorrido as $archivo) {
                if (! $archivo->isFile() || ! in_array($archivo->getExtension(), self::EXTENSIONES, true)) {
                    continue;
                }

                $ruta = str_replace('\\', '/', substr($archivo->getPathname(), strlen($raiz) + 1));
                $archivos[$ruta] = (string) file_get_contents($archivo->getPathname());
            }
        }

        return $archivos;
    }
}
