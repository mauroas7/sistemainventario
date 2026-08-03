<x-mail::message>
# Movimiento de bien informado

Se informó un movimiento a través de la ticketera del portal. Queda **pendiente de registrar en Diaguita**.

@include('emails.movimientos._datos')

<x-mail::button :url="route('recepcion.show', ['movimiento' => $movimiento->id])">
Ver el ticket en el portal
</x-mail::button>

Este correo se generó automáticamente al registrarse el movimiento. No hace falta responderlo.

Gestión de Bienes e Insumos<br>
{{ config('app.name') }}
</x-mail::message>
