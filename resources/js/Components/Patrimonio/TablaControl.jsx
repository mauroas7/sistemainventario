import { Link } from '@inertiajs/react';
import { Boton, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, ItemDeMenu, MenuDeAcciones, renglonTabla } from 'hu-kit/componentes';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

const ATENUADO = 'text-xs text-brandText-muted dark:text-brandText-mutedDark';

const ICONO_ESTADO = { Informado: 'schedule', Registrado: 'inventory', Cerrado: 'check_circle' };

// El paso que sigue en el circuito va como ícono; los demás estados, en el menú.
const PASO_SIGUIENTE = {
    Informado: { estado: 'Registrado', texto: 'Registrar en Diaguita' },
    Registrado: { estado: 'Cerrado', texto: 'Cerrar' },
};

/** La tabla del control patrimonial, con el cambio de estado en cada renglón. */
export default function TablaControl({ movimientos, estados, onCambiarEstado, hayFiltrosActivos }) {
    return (
        <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[60rem] text-sm">
                <thead>
                    <tr className={encabezadoTabla}>
                        <th className="px-5 pb-2 font-semibold">Ticket</th>
                        <th className="px-3 pb-2 font-semibold">Bien</th>
                        <th className="px-3 pb-2 font-semibold">Traslado</th>
                        <th className="px-3 pb-2 font-semibold">Responsable</th>
                        <th className="px-3 pb-2 font-semibold">Estado</th>
                        <th className="w-px px-5 pb-2 text-right font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className={cuerpoTabla}>
                    {movimientos.length > 0 ? (
                        movimientos.map((m) => {
                            const paso = PASO_SIGUIENTE[m.estado_movimiento.nombre];
                            const estadoDelPaso = paso && estados.find((estado) => estado.nombre === paso.estado);
                            const otrosEstados = estados.filter((estado) => estado.id !== m.estado_movimiento.id && estado.id !== estadoDelPaso?.id);
                            const estadoAnulado = otrosEstados.find((estado) => estado.nombre === 'Anulado');

                            return (
                                <tr key={m.id} className={`relative ${renglonTabla}`}>
                                    <td className="whitespace-nowrap px-5 py-3">
                                        {/* Sin el `after:` del enlace, sólo el identificador abre la auditoría. */}
                                        <Link
                                            href={route('patrimonio.movimientos.show', { movimiento: m.id })}
                                            className="font-semibold text-primary after:absolute after:inset-0 dark:text-gray-100"
                                        >
                                            TK-{m.id}
                                        </Link>
                                        <p className={ATENUADO}>{fechaYHora(m.fecha_movimiento)}</p>
                                    </td>
                                    <td className="min-w-48 px-3 py-3">
                                        <p className="text-brandText dark:text-brandText-dark">
                                            <span className="font-semibold">{m.bien.codigo}</span> - {m.bien.nombre}
                                        </p>
                                        <p className={`line-clamp-1 ${ATENUADO}`} title={m.bien.descripcion || undefined}>
                                            Diaguita: {m.bien.numero_diaguita || 'sin cargar'}
                                            {m.bien.descripcion && ` · ${m.bien.descripcion}`}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3">
                                        <p>
                                            {m.area_origen.nombre} → {m.area_destino.nombre}
                                        </p>
                                        <p className={ATENUADO}>{m.motivo.nombre}</p>
                                    </td>
                                    <td className="px-3 py-3">
                                        {m.responsable_anterior?.nombre || '—'} →{' '}
                                        {m.responsable_nuevo ? (
                                            <span className="font-semibold">{m.responsable_nuevo.nombre}</span>
                                        ) : (
                                            <span className="font-semibold text-secondary-dark dark:text-secondary">A definir</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <Estado partible tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>
                                            {m.estado_movimiento.nombre}
                                        </Estado>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="relative z-10 flex items-center justify-end gap-2">
                                            {estadoDelPaso && (
                                                <Boton
                                                    tipo="button"
                                                    variante="fantasma"
                                                    forma="grupo"
                                                    tamano="icono"
                                                    icono={ICONO_ESTADO[paso.estado]}
                                                    aria-label={`${paso.texto} el ticket TK-${m.id}`}
                                                    title={paso.texto}
                                                    onClick={() => onCambiarEstado(m, estadoDelPaso.id)}
                                                />
                                            )}
                                            <MenuDeAcciones etiqueta={`Más acciones del ticket TK-${m.id}`}>
                                                {otrosEstados
                                                    .filter((estado) => estado.nombre !== 'Anulado')
                                                    .map((estado) => (
                                                        <ItemDeMenu key={estado.id} icono={ICONO_ESTADO[estado.nombre]} onClick={() => onCambiarEstado(m, estado.id)}>
                                                            Pasar a {estado.nombre}
                                                        </ItemDeMenu>
                                                    ))}
                                                <ItemDeMenu icono="inventory_2" href={route('patrimonio.bienes.show', { bien: m.bien.id })}>
                                                    Ver ficha del bien
                                                </ItemDeMenu>
                                                {estadoAnulado && (
                                                    <ItemDeMenu icono="block" peligro separado onClick={() => onCambiarEstado(m, estadoAnulado.id)}>
                                                        Anular
                                                    </ItemDeMenu>
                                                )}
                                            </MenuDeAcciones>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6}>
                                <EstadoVacio enTarjeta icono="search_off">
                                    {hayFiltrosActivos ? 'Ningún movimiento coincide con los filtros aplicados.' : 'No hay movimientos registrados.'}
                                </EstadoVacio>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
