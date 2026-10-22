<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Lo que el código pide traducir existe en `lang/es`. El idioma de respaldo
 * también es es, así que una clave que falte no cae en el inglés del
 * framework: sale cruda a la pantalla («auth.failed», «validation.regex»).
 */
class TraduccionesTest extends TestCase
{
    /** Dónde se escriben reglas de validación: los modelos no, sus casts dirían falsos «json». */
    private const CARPETAS = ['app/Http', 'app/Console'];

    /** Las reglas de Laravel que tienen mensaje; `nullable` o `bail` no muestran nada. */
    private const REGLAS = [
        'accepted', 'after', 'after_or_equal', 'alpha', 'alpha_dash', 'alpha_num', 'array', 'before',
        'before_or_equal', 'between', 'boolean', 'confirmed', 'current_password', 'date', 'date_equals',
        'date_format', 'decimal', 'different', 'digits', 'digits_between', 'distinct', 'email', 'ends_with',
        'enum', 'exists', 'file', 'filled', 'gt', 'gte', 'image', 'in', 'in_array', 'integer', 'json',
        'lt', 'lte', 'max', 'mimes', 'mimetypes', 'min', 'not_in', 'not_regex', 'numeric', 'present',
        'prohibited', 'regex', 'required', 'required_if', 'required_unless', 'required_with',
        'required_without', 'same', 'size', 'starts_with', 'string', 'unique', 'url', 'uuid',
    ];

    private const RULE_A_CLAVE = [
        'enum' => 'enum', 'exists' => 'exists', 'in' => 'in', 'notIn' => 'not_in',
        'requiredIf' => 'required_if', 'unique' => 'unique',
    ];

    public function test_cada_regla_de_validacion_usada_tiene_su_mensaje_en_espanol(): void
    {
        $traducidas = require $this->raiz().'/lang/es/validation.php';
        $faltan = [];

        foreach ($this->archivos() as $archivo => $codigo) {
            preg_match_all("/'([a-z_]+)(?::[^']*)?'/", $codigo, $cadenas);
            preg_match_all('/Rule::([a-zA-Z]+)\(/', $codigo, $objetos);

            $usadas = [
                ...array_intersect($cadenas[1], self::REGLAS),
                ...array_filter(array_map(fn ($m) => self::RULE_A_CLAVE[$m] ?? null, $objetos[1])),
            ];

            foreach (array_unique($usadas) as $regla) {
                if (! array_key_exists($regla, $traducidas)) {
                    $faltan[] = "{$regla} (en {$archivo})";
                }
            }
        }

        $this->assertSame([], array_values(array_unique($faltan)), 'Reglas sin mensaje en lang/es/validation.php');
    }

    public function test_cada_clave_que_se_traduce_existe(): void
    {
        $faltan = [];

        foreach ($this->archivos(['app']) as $archivo => $codigo) {
            preg_match_all("/__\\('([a-z_]+)\\.([a-z_.]+)'/", $codigo, $claves, PREG_SET_ORDER);

            foreach ($claves as [, $grupo, $clave]) {
                $ruta = $this->raiz()."/lang/es/{$grupo}.php";
                $traducidas = is_file($ruta) ? require $ruta : [];

                if (! array_key_exists($clave, $traducidas)) {
                    $faltan[] = "{$grupo}.{$clave} (en {$archivo})";
                }
            }
        }

        $this->assertSame([], $faltan, 'Claves sin traducir en lang/es');
    }

    private function raiz(): string
    {
        return str_replace('\\', '/', dirname(__DIR__, 2));
    }

    /**
     * @param  array<int, string>  $carpetas
     * @return iterable<string, string>
     */
    private function archivos(array $carpetas = self::CARPETAS): iterable
    {
        foreach ($carpetas as $carpeta) {
            $recorrido = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->raiz().'/'.$carpeta));

            foreach ($recorrido as $archivo) {
                if ($archivo->isFile() && $archivo->getExtension() === 'php') {
                    yield str_replace($this->raiz().'/', '', str_replace('\\', '/', $archivo->getPathname())) => file_get_contents($archivo->getPathname());
                }
            }
        }
    }
}
