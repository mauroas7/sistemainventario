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
 * Aviso a quien tenía el bien a cargo cuando lo movió otra persona.
 *
 * Cubre el caso que hoy genera los conflictos: un área intermediaria retira un equipo
 * y el responsable patrimonial se entera después (o nunca). Si el movimiento lo informó
 * el propio responsable saliente, este correo no se envía.
 *
 * Se encola (ShouldQueue) para no hacer esperar al usuario mientras se habla con el SMTP.
 */
class MovimientoAvisoResponsableSaliente extends Mailable implements ShouldQueue
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
