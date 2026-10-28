<?php

namespace Database\Seeders\Demo;

use App\Models\Area;
use App\Models\Bien;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;
use App\Services\MovimientoService;
use Illuminate\Support\Facades\Auth;

/**
 * La demo con movimientos ya informados, para ver qué le toca a cada rol. Siembra
 * antes `DemoSeeder` y no hace nada si ya hay movimientos.
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

        $usuario = fn (string $nombre) => User::where('email', "{$nombre}@hospital.test")->firstOrFail();
        $patrimonio = $usuario('patrimonio');

        $informar = function (User $quien, string $codigo, string $destino, ?User $responsable, int $dias) use ($servicio) {
            $bien = Bien::where('codigo', $codigo)->firstOrFail();

            // Así el historial de estados lleva el nombre de quien hizo cada paso.
            Auth::setUser($quien);

            return $servicio->registrarMovimiento([
                'bien_id' => $bien->id,
                'creado_por' => $quien->id,
                'responsable_nuevo_id' => $responsable?->id,
                'area_origen_id' => $bien->area_id,
                'area_destino_id' => Area::where('nombre', $destino)->value('id'),
                'tipo_movimiento_id' => TipoMovimiento::orderBy('id')->value('id'),
                'motivo_id' => Motivo::orderBy('id')->value('id'),
                'fecha_movimiento' => now()->subDays($dias),
            ]);
        };

        // Carlos manda el electrocardiógrafo a Enfermería, a cargo de Ana.
        $informar($usuario('carlos'), 'ECG001', 'Enfermería', $usuario('ana'), 1);

        // Ana manda la tablet a Sistemas, Juan acusa recibo y Patrimonio cierra el trámite.
        $tablet = $informar($usuario('ana'), 'TAB001', 'Sistemas', $usuario('juan'), 6);
        Auth::setUser($usuario('juan'));
        $servicio->acusarRecibo($tablet, $usuario('juan'));
        Auth::setUser($patrimonio);
        $servicio->cerrarTramite($servicio->marcarRegistradoEnDiaguita($tablet, $patrimonio));

        // Juan manda una notebook a Enfermería sin saber quién la recibe.
        $informar($usuario('juan'), 'NB002', 'Enfermería', null, 2);

        // María manda un monitor a Enfermería, a cargo de Pedro, y Patrimonio lo registra.
        $monitor = $informar($usuario('maria'), 'MON001', 'Enfermería', $usuario('pedro'), 4);
        Auth::setUser($patrimonio);
        $servicio->marcarRegistradoEnDiaguita($monitor, $patrimonio);

        // María informa la impresora por error y la anula.
        $impresora = $informar($usuario('maria'), 'IMP001', 'Laboratorio', $usuario('carlos'), 3);
        $servicio->anularMovimiento($impresora);
    }
}
