import { Link } from '@inertiajs/react';
import { Estado } from 'hu-kit/componentes';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

const atenuado = 'text-brandText-muted dark:text-brandText-mutedDark';

/** El traslado de un bien en cinco líneas: ticket y estado, origen y destino, fecha y motivo, responsables y acuse. */
export default function ResumenTraslado({ m }) {
    const anulado = m.estado_movimiento.nombre === 'Anulado';

    return (
        <div>
            <div className="flex items-start justify-between gap-3">
                <Link
                    href={route('patrimonio.movimientos.show', { movimiento: m.id, desde: 'bien' })}
                    className={`font-semibold text-primary hover:underline dark:text-gray-100 ${anulado ? 'line-through' : ''}`}
                >
                    TK-{m.id}
                </Link>
                <Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
            </div>
            <p className={`mt-1 text-sm ${anulado ? atenuado : ''}`}>{m.area_origen.nombre} → {m.area_destino.nombre}</p>
            <p className={`mt-1 text-xs ${atenuado}`}>{fechaYHora(m.fecha_movimiento)} · {m.motivo.nombre}</p>
            <p className={`mt-1 text-xs ${anulado ? atenuado : ''}`}>
                {m.responsable_anterior?.nombre || '—'} → {m.responsable_nuevo?.nombre || 'A definir'}
            </p>
            <p className="mt-1 text-xs">
                {m.recibido_por ? `Acusado por ${m.recibido_por.nombre} el ${fechaYHora(m.fecha_recepcion)}` : 'Sin acuse de recibo'}
            </p>
        </div>
    );
}
