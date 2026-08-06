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
 * Acuse para quien informó el movimiento ("su ticket fue creado"), replicando el
 * comportamiento de las demás ticketeras del portal. Es el comprobante de que avisó:
 * sin esto, el responsable no tiene con qué respaldarse ante una auditoría.
 *
 * Se encola (ShouldQueue) para no hacer esperar al usuario mientras se habla con el SMTP.
 */
class MovimientoAcuseCreador extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Movimiento $movimiento) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[Bienes] Registramos su aviso · TK-{$this->movimiento->id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.movimientos.acuse-creador',
            with: ['movimiento' => $this->movimiento],
        );
    }
}
