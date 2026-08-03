@php
    $bien = $movimiento->bien;
@endphp

**Ticket:** TK-{{ $movimiento->id }}
**Fecha del movimiento:** {{ optional($movimiento->fecha_movimiento)->format('d/m/Y H:i') }}

**N° inventario (interno):** {{ $bien->codigo }}
**N° Diaguita:** {{ $bien->numero_diaguita ?: 'sin cargar en Diaguita' }}
**Bien:** {{ $bien->nombre }}@if($bien->descripcion) — {{ $bien->descripcion }}@endif

**Ubicación anterior:** {{ $movimiento->areaOrigen?->nombre ?? '—' }}
**Nueva ubicación:** {{ $movimiento->areaDestino?->nombre ?? '—' }}

**Responsable anterior:** {{ $movimiento->responsableAnterior?->name ?? 'sin asignar' }}
**Nuevo responsable:** {{ $movimiento->responsableNuevo?->name ?? 'A DEFINIR - el bien quedo en el area sin persona a cargo' }}

**Motivo:** {{ $movimiento->motivo?->nombre ?? '—' }}
**Informado por:** {{ $movimiento->creador?->name ?? '—' }}

@if($movimiento->observaciones_salida)
**Observaciones:** {{ $movimiento->observaciones_salida }}
@endif

@if($movimiento->imagen_salida)
Se adjuntó una fotografía del bien, visible en el detalle del ticket dentro del portal.
@endif
