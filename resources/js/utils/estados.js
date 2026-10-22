/** El tono de `Estado` para cada estado de un bien y de un trámite; uno desconocido va neutro. */
const TONO_BIEN = {
    disponible: 'exito',
    'en uso': 'info',
    prestado: 'aviso',
    'en mantenimiento': 'aviso',
    'dañado': 'error',
    baja: 'neutro',
};

const TONO_MOVIMIENTO = {
    informado: 'aviso',
    registrado: 'info',
    cerrado: 'exito',
    anulado: 'neutro',
};

export const tonoEstadoBien = (nombre) => TONO_BIEN[String(nombre ?? '').toLowerCase()] ?? 'neutro';

export const tonoEstadoMovimiento = (nombre) => TONO_MOVIMIENTO[String(nombre ?? '').toLowerCase()] ?? 'neutro';
