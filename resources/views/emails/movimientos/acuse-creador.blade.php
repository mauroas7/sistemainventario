<x-mail::message>
# Su aviso quedó registrado

Recibimos el aviso de movimiento del bien. Gestión de Bienes e Insumos lo va a volcar al sistema Diaguita y, si corresponde, va a coordinar la firma de la nueva ficha de inventario.

**Conserve este correo como constancia del aviso.**

@include('emails.movimientos._datos')

<x-mail::button :url="route('recepcion.show', ['movimiento' => $movimiento->id])">
Ver el ticket en el portal
</x-mail::button>

Este correo se generó automáticamente. No hace falta responderlo.

Gestión de Bienes e Insumos<br>
{{ config('app.name') }}
</x-mail::message>
