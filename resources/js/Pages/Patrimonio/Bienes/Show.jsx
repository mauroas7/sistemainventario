import { Link } from '@inertiajs/react';
import { Dato, Estado, EstadoVacio, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoBien, tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

const atenuado = 'text-brandText-muted dark:text-brandText-mutedDark';

export default function Show({ bien, movimientos = [] }) {
    return (
        <AppLayout
            titulo={`Ficha del bien ${bien.codigo}`}
            subtitulo={bien.nombre}
            volver={{ href: route('patrimonio.bienes.index'), etiqueta: 'Volver al directorio' }}
            estado={<Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Tarjeta titulo="Datos del bien" icono="inventory_2" className="h-fit">
                    <div className="space-y-4 text-sm">
                        <Dato etiqueta="Código" valor={bien.codigo} />
                        <Dato etiqueta="N° Diaguita" valor={bien.numero_diaguita} siFalta="Sin cargar" />
                        <Dato etiqueta="Descripción" valor={bien.nombre} />
                        <Dato etiqueta="Detalle" valor={bien.descripcion} />
                        <div className="space-y-4 border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                            <Dato etiqueta="Ubicación actual" valor={bien.ubicacion_actual?.nombre} />
                            <Dato etiqueta="Área" valor={bien.area?.nombre} />
                            <Dato etiqueta="Responsable" valor={bien.responsable?.nombre} siFalta="Sin asignar" />
                        </div>
                    </div>
                </Tarjeta>

                <Tarjeta titulo="Registro de movimientos" icono="history" contador={movimientos.length} className="lg:col-span-2">
                    {movimientos.length > 0 ? (
                        <ol className="space-y-4">
                            {movimientos.map((m) => (
                                <li key={m.id} className="border-l-2 border-secondary pl-3">
                                    <ResumenTraslado m={m} />
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <EstadoVacio enTarjeta icono="history">No hay movimientos asociados a este bien.</EstadoVacio>
                    )}
                </Tarjeta>
            </div>
        </AppLayout>
    );
}

/** El traslado de un bien en cinco líneas: ticket y estado, origen y destino, fecha y motivo, responsables y acuse. */
function ResumenTraslado({ m }) {
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
