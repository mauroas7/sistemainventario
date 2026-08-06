<?php

namespace App\Services;

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
     * Dispara los avisos de un movimiento recién informado.
     *
     * Nunca lanza excepción: el movimiento ya quedó registrado y perder el aviso es malo,
     * pero perder el dato patrimonial es peor.
     *
     * Los Mailables son ShouldQueue, así que acá solo se encolan: el try/catch cubre el
     * fallo al encolar, no el envío. Si el SMTP rechaza el correo, eso pasa después en el
     * worker y termina en la tabla `failed_jobs`, donde se puede revisar y reintentar con
     * `php artisan queue:retry`. Sin un worker corriendo, los avisos no salen.
     */
    public function notificarMovimientoInformado(Movimiento $movimiento): void
    {
        $movimiento->loadMissing(MovimientoService::RELACIONES);

        // 1. Gestión de Bienes: es quien tiene que volcarlo a Diaguita.
        $this->enviar(
            $this->destinatariosPatrimonio(),
            new MovimientoInformadoPatrimonio($movimiento),
            "aviso a Patrimonio del movimiento {$movimiento->id}"
        );

        // 2. Acuse a quien informó: su constancia de que avisó.
        if ($correo = $movimiento->creador?->email) {
            $this->enviar([$correo], new MovimientoAcuseCreador($movimiento), "acuse al creador del movimiento {$movimiento->id}");
        }

        // 3. Responsable saliente, salvo que sea la misma persona que informó.
        $saliente = $movimiento->responsableAnterior;

        if ($saliente?->email && (int) $saliente->id !== (int) $movimiento->creado_por) {
            $this->enviar(
                [$saliente->email],
                new MovimientoAvisoResponsableSaliente($movimiento),
                "aviso al responsable saliente del movimiento {$movimiento->id}"
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
            ->where('rol', 'admin')
            ->whereNotNull('email')
            ->pluck('email')
            ->all();
    }

    private function enviar(array $destinatarios, $mailable, string $contexto): void
    {
        $destinatarios = array_filter($destinatarios);

        if (empty($destinatarios)) {
            Log::warning("No hay destinatarios para el {$contexto}.");
            return;
        }

        try {
            Mail::to($destinatarios)->send($mailable);
        } catch (\Throwable $e) {
            Log::error("Falló el envío del {$contexto}: {$e->getMessage()}");
        }
    }
}
