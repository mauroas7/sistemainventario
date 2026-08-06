<?php

namespace App\Services;

use App\Models\Bien;
use App\Models\EstadoMovimiento;
use App\Models\Movimiento;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MovimientoService
{
    /**
     * Relaciones que necesitan todas las vistas de movimiento.
     */
    public const RELACIONES = [
        'bien',
        'creador',
        'receptor',
        'responsableAnterior',
        'responsableNuevo',
        'registrador',
        'areaOrigen',
        'areaDestino',
        'tipoMovimiento',
        'motivo',
        'estadoMovimiento',
    ];

    // Obtener todos los movimientos.
    public function obtenerTodos()
    {
        return Movimiento::with(self::RELACIONES)
            ->orderByDesc('fecha_movimiento')
            ->get();
    }

    /**
     * Query base de movimientos visibles para un usuario, con los mismos filtros que
     * usan tanto el listado paginado como el resumen agregado y la exportación, para
     * que las tres vistas siempre cuenten exactamente lo mismo.
     *
     * Filtros soportados: area_id (origen o destino), estado_movimiento_id,
     * tipo_movimiento_id, motivo_id, desde, hasta y bien (código o nombre).
     */
    private function consultaBase(?int $areaId, bool $esAdmin, array $filtros)
    {
        $query = Movimiento::query();

        if (! $esAdmin && $areaId) {
            $query->where(function ($q) use ($areaId) {
                $q->where('area_origen_id', $areaId)
                  ->orWhere('area_destino_id', $areaId);
            });
        }

        // Sector: el movimiento toca el área, ya sea como origen o como destino.
        if (! empty($filtros['area_id'])) {
            $query->where(function ($q) use ($filtros) {
                $q->where('area_origen_id', $filtros['area_id'])
                  ->orWhere('area_destino_id', $filtros['area_id']);
            });
        }

        foreach (['estado_movimiento_id', 'tipo_movimiento_id', 'motivo_id'] as $campo) {
            if (! empty($filtros[$campo])) {
                // Acepta un id suelto o una lista: la bandeja agrupa "Registrado" y
                // "Cerrado" bajo una misma pestaña.
                is_array($filtros[$campo])
                    ? $query->whereIn($campo, $filtros[$campo])
                    : $query->where($campo, $filtros[$campo]);
            }
        }

        if (! empty($filtros['desde'])) {
            $query->whereDate('fecha_movimiento', '>=', $filtros['desde']);
        }

        if (! empty($filtros['hasta'])) {
            $query->whereDate('fecha_movimiento', '<=', $filtros['hasta']);
        }

        if (! empty($filtros['bien'])) {
            $texto = trim($filtros['bien']);
            $query->whereHas('bien', function ($q) use ($texto) {
                $q->where('codigo', 'like', "%{$texto}%")
                  ->orWhere('numero_diaguita', 'like', "%{$texto}%")
                  ->orWhere('nombre', 'like', "%{$texto}%")
                  ->orWhere('descripcion', 'like', "%{$texto}%");
            });
        }

        return $query;
    }

    /**
     * Movimientos visibles para un usuario, con filtros opcionales del panel de control.
     * Si se pasa $porPagina, devuelve un paginador; si no, la colección completa
     * (usado por la bandeja de recepción, que siempre trabaja con el set completo).
     */
    public function obtenerParaBandeja(?int $areaId = null, bool $esAdmin = false, array $filtros = [], ?int $porPagina = null)
    {
        $query = $this->consultaBase($areaId, $esAdmin, $filtros)
            ->with(self::RELACIONES)
            ->orderByDesc('fecha_movimiento')
            ->orderByDesc('id');

        if ($porPagina) {
            return $query->paginate($porPagina)->withQueryString();
        }

        return $query->get();
    }

    /**
     * Totales por estado para los mismos filtros del listado, calculados con COUNT
     * agregado en base de datos (no sobre las filas de la página actual), para que
     * las tarjetas de resumen del dashboard sean correctas incluso paginando.
     */
    public function obtenerResumen(?int $areaId, bool $esAdmin, array $filtros): array
    {
        $base = fn () => $this->consultaBase($areaId, $esAdmin, $filtros);

        $porEstado = fn (array $nombres) => $base()
            ->whereHas('estadoMovimiento', fn ($q) => $q->whereIn('nombre', $nombres))
            ->count();

        return [
            'total' => $base()->count(),
            'informados' => $porEstado(['Informado']),
            'registrados' => $porEstado(['Registrado']),
            'cerrados' => $porEstado(['Cerrado']),
            'anulados' => $porEstado(['Anulado']),
        ];
    }

    /**
     * Registra un movimiento informado por un responsable.
     *
     * A diferencia del modelo anterior, el traslado es efectivo en el acto: el bien
     * cambia de ubicación y de responsable apenas se informa, sin esperar que nadie
     * lo confirme del otro lado. El circuito que queda abierto es el administrativo
     * de Patrimonio (volcarlo a Diaguita y hacer firmar la ficha), no el físico.
     */
    public function registrarMovimiento(array $datos): Movimiento
    {
        return DB::transaction(function () use ($datos) {
            $bien = Bien::query()->lockForUpdate()->findOrFail($datos['bien_id']);

            $estadoInformadoId = EstadoMovimiento::query()
                ->where('nombre', 'Informado')
                ->value('id') ?? EstadoMovimiento::query()->orderBy('id')->value('id');

            $movimiento = Movimiento::create(array_merge([
                'estado_movimiento_id' => $estadoInformadoId,
                'responsable_anterior_id' => $bien->responsable_id,
                'fecha_movimiento' => now(),
            ], $datos));

            $this->sincronizarUbicacionBien($movimiento->bien_id);

            return $movimiento->fresh(self::RELACIONES);
        });
    }

    // Actualizar un movimiento.
    public function actualizar(Movimiento $movimiento, array $datos)
    {
        $movimiento->update($datos);

        $this->sincronizarUbicacionBien($movimiento->bien_id);

        return $movimiento->fresh(self::RELACIONES);
    }

    /**
     * Acuse de recibo del nuevo responsable. Es opcional y NO condiciona la ubicación
     * del bien: sirve como constancia de que quien recibe está al tanto.
     */
    public function acusarRecibo(Movimiento $movimiento, User $usuario): Movimiento
    {
        $movimiento->update([
            'recibido_por' => $usuario->id,
            'fecha_recepcion' => now(),
        ]);

        return $movimiento->fresh(self::RELACIONES);
    }

    /**
     * Define quién queda a cargo del bien en un movimiento que se informó sin
     * responsable. Es el paso que hoy Patrimonio hace por teléfono antes de mandar a
     * firmar la ficha; acá queda registrado.
     */
    public function asignarResponsable(Movimiento $movimiento, ?int $responsableId): Movimiento
    {
        return DB::transaction(function () use ($movimiento, $responsableId) {
            $movimiento->update(['responsable_nuevo_id' => $responsableId]);

            $this->sincronizarUbicacionBien($movimiento->bien_id);

            return $movimiento->fresh(self::RELACIONES);
        });
    }

    /**
     * Patrimonio ya volcó el movimiento a Diaguita.
     */
    public function marcarRegistradoEnDiaguita(Movimiento $movimiento, User $usuario): Movimiento
    {
        $estadoId = EstadoMovimiento::query()->where('nombre', 'Registrado')->value('id');

        $movimiento->update([
            'estado_movimiento_id' => $estadoId,
            'registrado_por' => $usuario->id,
            'fecha_registro_diaguita' => now(),
        ]);

        return $movimiento->fresh(self::RELACIONES);
    }

    /**
     * Trámite terminado: la ficha de inventario fue firmada por el nuevo responsable.
     */
    public function cerrarTramite(Movimiento $movimiento): Movimiento
    {
        $estadoId = EstadoMovimiento::query()->where('nombre', 'Cerrado')->value('id');

        $movimiento->update([
            'estado_movimiento_id' => $estadoId,
            'fecha_cierre' => now(),
        ]);

        return $movimiento->fresh(self::RELACIONES);
    }

    /**
     * El movimiento se informó por error. Al anularlo, el bien vuelve a donde lo dejó
     * el último movimiento vigente.
     */
    public function anularMovimiento(Movimiento $movimiento): Movimiento
    {
        return DB::transaction(function () use ($movimiento) {
            $estadoAnuladoId = EstadoMovimiento::query()
                ->where('nombre', 'Anulado')
                ->value('id');

            $movimiento->update([
                'estado_movimiento_id' => $estadoAnuladoId,
                'recibido_por' => null,
                'fecha_recepcion' => null,
                'condicion_al_recibir' => null,
                'observaciones_recepcion' => null,
            ]);

            $this->sincronizarUbicacionBien($movimiento->bien_id);

            return $movimiento->fresh(self::RELACIONES);
        });
    }

    /**
     * Recalcula dónde está un bien y quién lo tiene a cargo a partir de su historial,
     * en vez de confiar en el último cambio suelto. Todo movimiento no anulado es
     * efectivo, así que manda el más reciente; anular uno devuelve el bien a donde lo
     * dejó el anterior, sin importar en qué orden se hayan editado.
     */
    public function sincronizarUbicacionBien(int $bienId): void
    {
        $ultimoVigente = Movimiento::query()
            ->where('bien_id', $bienId)
            ->whereHas('estadoMovimiento', fn ($q) => $q->where('nombre', '!=', 'Anulado'))
            ->orderByDesc('fecha_movimiento')
            ->orderByDesc('id')
            ->first();

        if ($ultimoVigente) {
            $areaId = $ultimoVigente->area_destino_id;
            $responsableId = $ultimoVigente->responsable_nuevo_id;
        } else {
            // Sin ningún movimiento vigente, el bien vuelve al punto de partida del primero.
            $primero = Movimiento::query()
                ->where('bien_id', $bienId)
                ->orderBy('fecha_movimiento')
                ->orderBy('id')
                ->first();

            if (! $primero) {
                return;
            }

            $areaId = $primero->area_origen_id;
            $responsableId = $primero->responsable_anterior_id;
        }

        // El responsable del último movimiento manda, incluso si es null: eso significa
        // "el bien está en el área destino pero todavía no tiene una persona a cargo",
        // y es información valiosa (Patrimonio tiene que definirla). Arrastrar al
        // responsable anterior sería peor: le atribuiría un bien que ya no tiene.
        Bien::query()->whereKey($bienId)->update([
            'area_id' => $areaId,
            'ubicacion_actual_id' => $areaId,
            'responsable_id' => $responsableId,
        ]);
    }

    /**
     * Cambio de estado manual desde el panel de Patrimonio. Cada estado arrastra sus
     * efectos administrativos para que la fila no quede en un estado inconsistente.
     */
    public function actualizarEstado(Movimiento $movimiento, int $estadoId, User $usuario): Movimiento
    {
        return DB::transaction(function () use ($movimiento, $estadoId, $usuario) {
            $estado = EstadoMovimiento::query()->findOrFail($estadoId);

            $update = ['estado_movimiento_id' => $estado->id];

            switch ($estado->nombre) {
                case 'Registrado':
                    $update['registrado_por'] = $movimiento->registrado_por ?? $usuario->id;
                    $update['fecha_registro_diaguita'] = $movimiento->fecha_registro_diaguita ?? now();
                    $update['fecha_cierre'] = null;
                    break;

                case 'Cerrado':
                    $update['registrado_por'] = $movimiento->registrado_por ?? $usuario->id;
                    $update['fecha_registro_diaguita'] = $movimiento->fecha_registro_diaguita ?? now();
                    $update['fecha_cierre'] = now();
                    break;

                case 'Informado':
                    // Vuelve al principio del circuito administrativo.
                    $update['registrado_por'] = null;
                    $update['fecha_registro_diaguita'] = null;
                    $update['fecha_cierre'] = null;
                    break;

                case 'Anulado':
                    $update['recibido_por'] = null;
                    $update['fecha_recepcion'] = null;
                    $update['condicion_al_recibir'] = null;
                    $update['observaciones_recepcion'] = null;
                    $update['fecha_cierre'] = null;
                    break;
            }

            $movimiento->update($update);

            // El estado ya está persistido: recién ahora el historial refleja la verdad.
            $this->sincronizarUbicacionBien($movimiento->bien_id);

            return $movimiento->fresh(self::RELACIONES);
        });
    }
}
