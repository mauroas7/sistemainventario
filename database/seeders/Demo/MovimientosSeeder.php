<?php

namespace Database\Seeders\Demo;

use App\Models\Area;
use App\Models\Bien;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;
use App\Services\MovimientoService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/**
 * La demo con diez movimientos de las últimas tres semanas, uno por cada paso del
 * circuito, para ver qué le toca a cada rol. Siembra antes `DemoSeeder` y no hace
 * nada si ya hay movimientos.
 */
class MovimientosSeeder extends SeederDePrueba
{
    public function run(MovimientoService $servicio): void
    {
        if (Movimiento::exists()) {
            $this->command?->warn('Ya hay movimientos: la demo de movimientos no se vuelve a sembrar.');

            return;
        }

        $this->call(DemoSeeder::class);

        $cuenta = fn (string $puesto, string $area) => User::where('email', DemoSeeder::correo($puesto, $area))->firstOrFail();
        $silvana = $cuenta('admin1', 'Patrimonio');
        $gustavo = $cuenta('admin2', 'Patrimonio');
        $juan = $cuenta('coordinador', 'Sistemas');
        $nicolas = $cuenta('usuario1', 'Sistemas');
        $maria = $cuenta('usuario1', 'Administración');
        $pablo = $cuenta('usuario2', 'Administración');
        $ana = $cuenta('usuario1', 'Enfermería');
        $sofia = $cuenta('coordinador', 'Laboratorio');
        $carlos = $cuenta('usuario1', 'Laboratorio');
        $martin = $cuenta('usuario2', 'Laboratorio');
        $roberto = $cuenta('coordinador', 'Mantenimiento');
        $sergio = $cuenta('usuario1', 'Mantenimiento');

        // Cada paso pasa el día que dice y lo hace quien lo firma, así fechas e historial cuentan la misma historia.
        $hoy = now();
        $el = function (int $diasAtras, User $quien) use ($hoy) {
            Carbon::setTestNow($hoy->copy()->subDays($diasAtras));
            Auth::setUser($quien);
        };

        $informar = fn (User $quien, string $codigo, string $destino, ?User $responsable, string $tipo, string $motivo, array $extra = []) => $servicio->registrarMovimiento([
            'bien_id' => Bien::where('codigo', $codigo)->value('id'),
            'creado_por' => $quien->id,
            'responsable_nuevo_id' => $responsable?->id,
            'area_origen_id' => Bien::where('codigo', $codigo)->value('area_id'),
            'area_destino_id' => Area::where('nombre', $destino)->value('id'),
            'tipo_movimiento_id' => TipoMovimiento::where('nombre', $tipo)->value('id'),
            'motivo_id' => Motivo::where('nombre', $motivo)->value('id'),
            ...$extra,
        ]);

        try {
            // Préstamo cerrado: Mantenimiento presta el taladro a Laboratorio.
            $el(20, $sergio);
            $prestamo = $informar($sergio, 'TAL001', 'Laboratorio', $martin, 'Préstamo', 'Préstamo');
            $el(19, $martin);
            $servicio->acusarRecibo($prestamo, $martin);
            $el(18, $silvana);
            $prestamo = $servicio->marcarRegistradoEnDiaguita($prestamo, $silvana);
            $el(15, $silvana);
            $servicio->cerrarTramite($prestamo);

            // Olvidado: hace más de dos semanas que nadie acusa la balanza ni la carga en Diaguita.
            $el(16, $cuenta('usuario1', 'Farmacia'));
            $informar(Auth::user(), 'BAL001', 'Laboratorio', $sofia, 'Préstamo', 'Préstamo');

            // Circuito completo: la tablet pasa a Sistemas, Juan acusa y Patrimonio cierra.
            $el(12, $ana);
            $tablet = $informar($ana, 'TAB001', 'Sistemas', $juan, 'Transferencia', 'Cambio de área');
            $el(11, $juan);
            $servicio->acusarRecibo($tablet, $juan);
            $el(10, $silvana);
            $tablet = $servicio->marcarRegistradoEnDiaguita($tablet, $silvana);
            $el(6, $silvana);
            $servicio->cerrarTramite($tablet);

            // Devolución del taladro: acusa el coordinador en lugar del responsable.
            $el(7, $martin);
            $devolucion = $informar($martin, 'TAL001', 'Mantenimiento', $sergio, 'Devolución', 'Devolución');
            $el(6, $roberto);
            $servicio->acusarRecibo($devolucion, $roberto);
            $el(5, $gustavo);
            $servicio->marcarRegistradoEnDiaguita($devolucion, $gustavo);

            // Registrado en Diaguita y todavía sin acuse: Pablo lo tiene para acusar.
            $el(5, $cuenta('usuario1', 'Recursos Humanos'));
            $pc = $informar(Auth::user(), 'PC001', 'Administración', $pablo, 'Transferencia', 'Cambio de área');
            $el(4, $silvana);
            $servicio->marcarRegistradoEnDiaguita($pc, $silvana);

            // Informado por error y anulado: la impresora vuelve a Administración.
            $el(4, $pablo);
            $impresora = $informar($pablo, 'IMP001', 'Laboratorio', $carlos, 'Transferencia', 'Cambio de área', [
                'observaciones_salida' => 'Se cargó por error: la impresora no se movió.',
            ]);
            $servicio->anularMovimiento($impresora);

            // Acusado y pendiente de Diaguita.
            $el(3, $maria);
            $monitor = $informar($maria, 'MON001', 'Sistemas', $nicolas, 'Transferencia', 'Cambio de área');
            $el(2, $nicolas);
            $servicio->acusarRecibo($monitor, $nicolas);

            // Sin responsable: lo acusa la coordinadora de Enfermería y lo define Patrimonio.
            $el(2, $juan);
            $informar($juan, 'NB002', 'Enfermería', null, 'Transferencia', 'Cambio de área');

            // Recién informado, con foto: Ana y Laura lo tienen para acusar.
            $el(1, $carlos);
            $informar($carlos, 'ECG001', 'Enfermería', $ana, 'Transferencia', 'Cambio de área', [
                'observaciones_salida' => 'Va con el cable de alimentación y el manual.',
                'imagen_salida' => $this->fotoDeEjemplo('ECG001'),
            ]);

            // Informado hoy por Patrimonio, para una capacitación.
            $el(0, $silvana);
            $informar($silvana, 'PRO001', 'Recursos Humanos', $cuenta('coordinador', 'Recursos Humanos'), 'Préstamo', 'Evento');
        } finally {
            Carbon::setTestNow();
        }
    }

    /** Una imagen lisa con el código del bien, en el disco privado de las fotos. Sin GD, no hay foto. */
    private function fotoDeEjemplo(string $codigo): ?string
    {
        if (! function_exists('imagecreatetruecolor')) {
            return null;
        }

        $imagen = imagecreatetruecolor(640, 480);
        imagefill($imagen, 0, 0, imagecolorallocate($imagen, 214, 222, 235));
        imagestring($imagen, 5, 290, 232, $codigo, imagecolorallocate($imagen, 16, 42, 84));

        ob_start();
        imagejpeg($imagen);
        $contenido = ob_get_clean();
        imagedestroy($imagen);

        $ruta = "movimientos/demo-{$codigo}.jpg";
        Storage::disk('local')->put($ruta, $contenido);

        return $ruta;
    }
}
