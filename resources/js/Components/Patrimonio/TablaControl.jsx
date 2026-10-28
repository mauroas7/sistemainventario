import { Boton, claseControl, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, renglonTabla } from 'hu-kit/componentes';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

/** La tabla del control patrimonial, con el cambio de estado en cada renglón. */
export default function TablaControl({ movimientos, estados, estadoElegido, onElegirEstado, onGuardarEstado, hayFiltrosActivos }) {
    return (
        <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-max text-sm">
                <thead>
                    <tr className={encabezadoTabla}>
                        <th className="px-5 pb-2 font-semibold">N° Inventario</th>
                        <th className="px-3 pb-2 font-semibold">N° Diaguita</th>
                        <th className="px-3 pb-2 font-semibold">Fecha</th>
                        <th className="px-3 pb-2 font-semibold">Ubicación actual</th>
                        <th className="px-3 pb-2 font-semibold">Responsable actual</th>
                        <th className="px-3 pb-2 font-semibold">Descripción del bien</th>
                        <th className="px-3 pb-2 font-semibold">Detalle del bien</th>
                        <th className="px-3 pb-2 font-semibold">Nueva ubicación</th>
                        <th className="px-3 pb-2 font-semibold">Nuevo responsable</th>
                        <th className="px-3 pb-2 font-semibold">Motivo del traslado</th>
                        <th className="px-3 pb-2 font-semibold">Estado actual</th>
                        <th className="px-5 pb-2 font-semibold">Nuevo estado</th>
                    </tr>
                </thead>
                <tbody className={cuerpoTabla}>
                    {movimientos.length > 0 ? (
                        movimientos.map((m) => (
                            <tr key={m.id} className={renglonTabla}>
                                <td className="whitespace-nowrap px-5 py-3 font-semibold text-primary dark:text-gray-100">{m.bien.codigo}</td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {m.bien.numero_diaguita || <span className="italic text-brandText-muted dark:text-brandText-mutedDark">sin cargar</span>}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">{fechaYHora(m.fecha_movimiento)}</td>
                                <td className="whitespace-nowrap px-3 py-3">{m.area_origen.nombre}</td>
                                <td className="whitespace-nowrap px-3 py-3">{m.responsable_anterior?.nombre || '—'}</td>
                                <td className="whitespace-nowrap px-3 py-3">{m.bien.nombre}</td>
                                <td className="max-w-xs truncate px-3 py-3" title={m.bien.descripcion || undefined}>
                                    {m.bien.descripcion || '—'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">{m.area_destino.nombre}</td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {m.responsable_nuevo?.nombre || <span className="font-semibold text-secondary-dark dark:text-secondary">A definir</span>}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">{m.motivo.nombre}</td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <select
                                            aria-label={`Nuevo estado del ticket TK-${m.id}`}
                                            value={estadoElegido(m)}
                                            onChange={(e) => onElegirEstado(m.id, e.target.value)}
                                            className={`${claseControl(false)} min-w-36`}
                                        >
                                            {estados.map((estado) => (
                                                <option key={estado.id} value={estado.id}>
                                                    {estado.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <Boton tipo="button" forma="grupo" onClick={() => onGuardarEstado(m)}>
                                            Guardar
                                        </Boton>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={12}>
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
