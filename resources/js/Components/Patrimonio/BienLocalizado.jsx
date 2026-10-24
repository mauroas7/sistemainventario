import { Boton, Dato, Estado, Rotulo, Tarjeta } from 'hu-kit/componentes';
import { tonoEstadoBien, tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

/** Un resultado del localizador: dónde está el bien, quién lo tiene y su último movimiento. */
export default function BienLocalizado({ bien, ultimo }) {
    return (
        <Tarjeta
            titulo={`${bien.codigo} · ${bien.nombre}`}
            icono="inventory_2"
            acciones={
                <Boton variante="fantasma" forma="grupo" icono="history" href={route('patrimonio.bienes.show', { bien: bien.id })}>
                    Ver historial completo
                </Boton>
            }
        >
            <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">Diaguita: {bien.numero_diaguita || 'sin cargar'}</p>
            {bien.descripcion && <p className="mt-1 text-sm">{bien.descripcion}</p>}

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-brandText-soft/70 pt-4 text-sm sm:grid-cols-3 dark:border-gray-800">
                <Dato etiqueta="Ubicación actual" valor={bien.ubicacion_actual?.nombre || bien.area?.nombre} />
                <Dato etiqueta="Responsable actual" valor={bien.responsable?.nombre} siFalta="Sin asignar" />
                <Dato etiqueta="Estado del bien" valor={<Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>} />
            </div>

            <div className="mt-4 border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                <Rotulo como="h3" className="mb-3 block">Último movimiento</Rotulo>

                {ultimo ? (
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <Dato etiqueta="Ticket" valor={`TK-${ultimo.id}`} />
                        <Dato
                            etiqueta="Estado"
                            valor={<Estado tono={tonoEstadoMovimiento(ultimo.estado_movimiento.nombre)}>{ultimo.estado_movimiento.nombre}</Estado>}
                        />
                        <Dato etiqueta="Traslado" valor={`${ultimo.area_origen.nombre} → ${ultimo.area_destino.nombre}`} />
                        <Dato etiqueta="Fecha" valor={fechaYHora(ultimo.fecha_movimiento)} />
                        <Dato etiqueta="Responsable anterior" valor={ultimo.responsable_anterior?.nombre} />
                        <Dato etiqueta="Quedó a cargo" valor={ultimo.responsable_nuevo?.nombre} />
                        <Dato etiqueta="Motivo" valor={ultimo.motivo.nombre} className="sm:col-span-2" />
                    </div>
                ) : (
                    <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">Este bien no tiene movimientos registrados todavía.</p>
                )}
            </div>
        </Tarjeta>
    );
}
