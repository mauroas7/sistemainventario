<?php

namespace App\Mail;

use App\Models\Movimiento;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Aviso a quien tenía el bien a cargo cuando lo movió otra persona, por ejemplo
 * un área intermediaria que retira un equipo. Si lo informó el propio responsable
 * saliente, no se envía.
 */
class MovimientoAvisoResponsableSaliente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Movimiento $movimiento) {}

    public function envelope(): Envelope
    {
        $bien = $this->movimiento->bien;

        return new Envelope(
            subject: "[Bienes] Se registró la salida de un bien a su cargo · {$bien->codigo}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.movimientos.aviso-responsable-saliente',
            with: ['movimiento' => $this->movimiento],
        );
    }
}
