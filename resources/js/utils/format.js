const ESTADO_BIEN_CLASES = {
    'disponible': 'bg-green-100 text-green-800 border-green-200',
    'en uso': 'bg-blue-100 text-blue-800 border-blue-200',
    'prestado': 'bg-amber-100 text-amber-800 border-amber-200',
    'en mantenimiento': 'bg-orange-100 text-orange-800 border-orange-200',
    'dañado': 'bg-red-100 text-red-800 border-red-200',
    'baja': 'bg-gray-200 text-gray-700 border-gray-300',
};

export function estadoBienClase(nombre) {
    return ESTADO_BIEN_CLASES[String(nombre ?? '').toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
}

// Estados del trámite de un movimiento, tal como lo sigue Gestión de Bienes.
const ESTADO_MOVIMIENTO_CLASES = {
    'informado': 'bg-amber-100 text-amber-800 border-amber-200',
    'registrado': 'bg-blue-100 text-blue-800 border-blue-200',
    'cerrado': 'bg-green-100 text-green-800 border-green-200',
    'anulado': 'bg-gray-200 text-gray-700 border-gray-300',
};

export function estadoMovimientoClase(nombre) {
    return ESTADO_MOVIMIENTO_CLASES[String(nombre ?? '').toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export function formatFecha(valor) {
    if (!valor) return '—';

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return '—';

    return fecha.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
