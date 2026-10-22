<?php

namespace App\Mail;

use App\Models\Movimiento;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Acuse para quien informó el movimiento, como en las demás ticketeras del portal:
 * es su comprobante de que avisó.
 */
class MovimientoAcuseCreador extends Mailable
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
