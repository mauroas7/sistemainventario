import { Link } from '@inertiajs/react';
import { Buscador, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, Paginador, renglonTabla, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoBien, tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';
import { useBusquedaEnServidor } from '@/utils/busqueda';

const ATENUADO = 'text-xs text-brandText-muted dark:text-brandText-mutedDark';

export default function Index({ bienes, ultimosMovimientos = {}, busqueda: busquedaDelServidor = '' }) {
    const [busqueda, setBusqueda] = useBusquedaEnServidor('patrimonio.localizador.index', busquedaDelServidor);

    return (
        <AppLayout
            titulo="Localizador de bienes"
            subtitulo="Buscá por número de inventario interno, número de Diaguita, nombre o descripción."
        >
            <Tarjeta className="mb-6">
                <Buscador
                    nombre="busqueda"
                    etiqueta="Buscar bien"
                    valor={busqueda}
                    onChange={setBusqueda}
                    placeholder="Ej: MON001, 950003, notebook, impresora…"
                    autoFocus
                />
            </Tarjeta>

            <Tarjeta titulo="Resultados" icono="travel_explore" contador={bienes.total}>
                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[52rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">Bien</th>
                                <th className="px-3 pb-2 font-semibold">Dónde está</th>
                                <th className="px-3 pb-2 font-semibold">Responsable</th>
                                <th className="px-3 pb-2 font-semibold">Estado</th>
                                <th className="px-5 pb-2 font-semibold">Último traslado</th>
                            </tr>
                        </thead>
                        <tbody className={cuerpoTabla}>
                            {bienes.data.length > 0 ? (
                                bienes.data.map((bien) => {
                                    const ultimo = ultimosMovimientos[bien.id];
                                    const anulado = ultimo?.estado_movimiento.nombre === 'Anulado';

                                    return (
                                        <tr key={bien.id} className={`relative ${renglonTabla}`}>
                                            <td className="min-w-40 px-5 py-3">
                                                <Link
                                                    href={route('patrimonio.bienes.show', { bien: bien.id })}
                                                    className="font-semibold text-primary after:absolute after:inset-0 dark:text-gray-100"
                                                >
                                                    {bien.codigo}
                                                </Link>
                                                <p className={ATENUADO}>{bien.nombre}</p>
                                            </td>
                                            <td className="px-3 py-3 font-semibold">{bien.ubicacion_actual?.nombre || bien.area?.nombre}</td>
                                            <td className="px-3 py-3">
                                                {bien.responsable?.nombre || (
                                                    <span className="text-brandText-muted dark:text-brandText-mutedDark">sin asignar</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Estado partible tono={tonoEstadoBien(bien.estado?.nombre)}>
                                                    {bien.estado?.nombre || '—'}
                                                </Estado>
                                            </td>
                                            <td className="min-w-64 px-5 py-3">
                                                {ultimo ? (
                                                    <>
                                                        <p className="flex flex-wrap items-center gap-2">
                                                            <span className="font-semibold">TK-{ultimo.id}</span>
                                                            <Estado partible tono={tonoEstadoMovimiento(ultimo.estado_movimiento.nombre)}>
                                                                {ultimo.estado_movimiento.nombre}
                                                            </Estado>
                                                        </p>
                                                        <p className={ATENUADO}>
                                                            {ultimo.area_origen.nombre} → {ultimo.area_destino.nombre} · {fechaYHora(ultimo.fecha_movimiento)}
                                                            {!anulado && ` · ${ultimo.recibido_por ? 'con acuse' : 'sin acuse'}`}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <span className={ATENUADO}>Sin traslados</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <EstadoVacio enTarjeta icono="search_off">
                                            {busquedaDelServidor ? `No se encontraron bienes para «${busquedaDelServidor}».` : 'No hay bienes cargados.'}
                                        </EstadoVacio>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 empty:hidden">
                    <Paginador paginador={bienes} />
                </div>
            </Tarjeta>
        </AppLayout>
    );
}
