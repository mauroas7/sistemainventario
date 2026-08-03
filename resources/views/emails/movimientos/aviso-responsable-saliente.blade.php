<x-mail::message>
# Se registró la salida de un bien a su cargo

{{ $movimiento->creador?->name ?? 'Otro usuario' }} informó el movimiento de un bien que figuraba bajo su responsabilidad.

**Si esto no es correcto, comuníquese con Gestión de Bienes e Insumos antes de que el movimiento se registre en Diaguita.**

@include('emails.movimientos._datos')

<x-mail::button :url="route('recepcion.show', ['movimiento' => $movimiento->id])">
Ver el ticket en el portal
</x-mail::button>

Este correo se generó automáticamente. No hace falta responderlo.

Gestión de Bienes e Insumos<br>
{{ config('app.name') }}
</x-mail::message>
