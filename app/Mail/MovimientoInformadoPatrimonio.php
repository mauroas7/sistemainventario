<?php

namespace App\Mail;

use App\Models\Movimiento;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Aviso a Gestión de Bienes: hay un movimiento informado que hay que volcar a Diaguita.
 * Es el correo que reemplaza al grupo de WhatsApp y da constancia formal del aviso.
 *
 * Se encola (ShouldQueue) para que el diálogo con el SMTP no ocurra dentro del request:
 * quien informa el movimiento no tiene por qué esperar a que el servidor de correo
 * conteste, ni quedarse colgado si está lento.
 */
class MovimientoInformadoPatrimonio extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Movimiento $movimiento) {}

    public function envelope(): Envelope
    {
        $bien = $this->movimiento->bien;

        return new Envelope(
            subject: "[Bienes] TK-{$this->movimiento->id} · {$bien->codigo} · {$this->movimiento->motivo?->nombre}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.movimientos.informado-patrimonio',
            with: ['movimiento' => $this->movimiento],
        );
    }
}
