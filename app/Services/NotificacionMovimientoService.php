<?php

namespace App\Services;

use App\Enums\Rol;
use App\Mail\MovimientoAcuseCreador;
use App\Mail\MovimientoAvisoResponsableSaliente;
use App\Mail\MovimientoInformadoPatrimonio;
use App\Models\Movimiento;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificacionMovimientoService
{
    /**
     * Manda los avisos de un movimiento recién informado, en el momento y sin cola.
     * Nunca lanza excepción: el movimiento ya quedó registrado, y un correo que no
     * sale queda en el log.
     */
    public function notificarMovimientoInformado(Movimiento $movimiento): void
    {
        $movimiento->loadMissing(MovimientoService::RELACIONES);

        // Gestión de Bienes: es quien tiene que volcarlo a Diaguita.
        $this->enviar(
            $this->destinatariosPatrimonio(),
            new MovimientoInformadoPatrimonio($movimiento),
            'aviso a Patrimonio',
            $movimiento->id
        );

        // Acuse a quien informó: su constancia de que avisó.
        if ($correo = $movimiento->creador?->email) {
            $this->enviar([$correo], new MovimientoAcuseCreador($movimiento), 'acuse al creador', $movimiento->id);
        }

        // Responsable saliente, salvo que sea la misma persona que informó.
        $saliente = $movimiento->responsableAnterior;

        if ($saliente?->email && (int) $saliente->id !== (int) $movimiento->creado_por) {
            $this->enviar(
                [$saliente->email],
                new MovimientoAvisoResponsableSaliente($movimiento),
                'aviso al responsable saliente',
                $movimiento->id
            );
        }
    }

    /**
     * Casillas de Gestión de Bienes. Se puede fijar una lista explícita por config
     * (patrimonio.notificaciones_email); si no hay ninguna, se cae a los usuarios
     * con rol admin, para que el sistema nunca quede sin avisar a nadie.
     */
    public function destinatariosPatrimonio(): array
    {
        $configurados = array_filter(array_map(
            'trim',
            explode(',', (string) config('patrimonio.notificaciones_email'))
        ));

        if (! empty($configurados)) {
            return $configurados;
        }

        return User::query()
            ->where('rol', Rol::Admin)
            ->whereNotNull('email')
            ->pluck('email')
            ->all();
    }

    private function enviar(array $destinatarios, $mailable, string $aviso, int $movimientoId): void
    {
        $destinatarios = array_filter($destinatarios);

        if (empty($destinatarios)) {
            Log::warning('NotificacionMovimientoService@enviar - sin destinatarios', ['aviso' => $aviso, 'movimiento_id' => $movimientoId]);

            return;
        }

        try {
            Mail::to($destinatarios)->send($mailable);
        } catch (\Throwable $e) {
            Log::error('NotificacionMovimientoService@enviar - no salió el mail', [
                'aviso' => $aviso,
                'movimiento_id' => $movimientoId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
