import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Alerta,
    Boton,
    cuerpoTabla,
    encabezadoTabla,
    Estado,
    EstadoVacio,
    ItemDeMenu,
    MenuDeAcciones,
    ModalConfirmar,
    Paginador,
    renglonTabla,
    Solapas,
    Tarjeta,
    useConfirmacion,
} from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';
import { puedeAcusar, puedeAnular, relacion } from '@/utils/movimientos';

const PESTANAS = [
    { clave: 'por_acusar', etiqueta: 'Para acusar recibo', vacia: 'No tenés bienes para acusar recibo.' },
    { clave: 'enviados', etiqueta: 'Enviados por mí', vacia: 'Todavía no informaste ningún traslado.' },
    { clave: 'todos', etiqueta: 'Todos', vacia: 'No hay tickets para mostrar.' },
];

const SUBTITULO = {
    patrimonio: 'Los tickets de todo el hospital.',
    coordinador: 'Los tickets que salen de tu área o llegan a él.',
    usuario: 'Los tickets que informaste y los de bienes que estuvieron o quedan a tu cargo.',
};

export default function Bandeja({ movimientos, pestana = 'todos', contadores }) {
    const usuario = usePage().props.auth.usuario;
    const { confirmar, props: modal } = useConfirmacion();
    const [error, setError] = useState('');
    const [acusando, setAcusando] = useState(false);
    const conRelacion = usuario.rol !== 'patrimonio';

    const avisoDeError = (mensajePorDefecto) => (errores) => setError(Object.values(errores)[0] || mensajePorDefecto);

    const acusar = (m) => {
        setError('');
        router.post(route('recepcion.confirmar', { movimiento: m.id }), {}, {
            preserveScroll: true,
            onStart: () => setAcusando(true),
            onFinish: () => setAcusando(false),
            onError: avisoDeError('No se pudo confirmar la recepción'),
        });
    };

    const anular = (m) => {
        setError('');
        confirmar({
            titulo: `Anular el ticket TK-${m.id}`,
            detalle: 'El bien vuelve a su ubicación y responsable anteriores. El ticket queda en el historial como anulado.',
            textoAceptar: 'Anular',
            accion: (r) => r.post(route('recepcion.anular', { movimiento: m.id }), {}, {
                preserveScroll: true,
                onError: avisoDeError('No se pudo anular el ticket'),
            }),
        });
    };

    return (
        <AppLayout titulo="Bandeja de recepción" subtitulo={SUBTITULO[usuario.rol]}>
            {/* El filtrado y el conteo los hace la base: cada solapa es una visita. */}
            <Solapas
                etiqueta="Qué tickets se muestran"
                actual={pestana}
                opciones={PESTANAS.map(({ clave, etiqueta }) => ({
                    clave,
                    etiqueta: `${etiqueta} (${contadores[clave]})`,
                    href: route('recepcion.bandeja', { ver: clave }),
                }))}
                className="mb-4"
            />

            <Tarjeta titulo="Tickets" icono="move_to_inbox" contador={movimientos.total}>
                {error && <Alerta tipo="error" className="mb-4">{error}</Alerta>}

                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[60rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">Ticket</th>
                                <th className="px-3 pb-2 font-semibold">Bien</th>
                                <th className="px-3 pb-2 font-semibold">Traslado</th>
                                <th className="px-3 pb-2 font-semibold">Responsable</th>
                                {conRelacion && <th className="px-3 pb-2 font-semibold">Relación</th>}
                                <th className="px-3 pb-2 font-semibold">Estado</th>
                                <th className="w-px px-5 pb-2 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={cuerpoTabla}>
                            {movimientos.data.length > 0 ? (
                                movimientos.data.map((m) => (
                                    <tr key={m.id} className={`relative ${renglonTabla}`}>
                                        <td className="whitespace-nowrap px-5 py-3">
                                            {/* Sin el `after:` del enlace, sólo el identificador abre el ticket. */}
                                            <Link
                                                href={route('recepcion.show', { movimiento: m.id, ver: pestana })}
                                                className="font-semibold text-primary after:absolute after:inset-0 dark:text-gray-100"
                                            >
                                                TK-{m.id}
                                            </Link>
                                            <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">{fechaYHora(m.fecha_movimiento)}</p>
                                        </td>
                                        <td className="min-w-48 px-3 py-3">
                                            <p className="text-brandText dark:text-brandText-dark">
                                                <span className="font-semibold">{m.bien.codigo}</span> - {m.bien.nombre}
                                            </p>
                                            <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">
                                                Diaguita: {m.bien.numero_diaguita || 'sin cargar'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">{m.area_origen.nombre} → {m.area_destino.nombre}</td>
                                        <td className="px-3 py-3">
                                            {m.responsable_anterior?.nombre || '—'} →{' '}
                                            {m.responsable_nuevo ? (
                                                <span className="font-semibold">{m.responsable_nuevo.nombre}</span>
                                            ) : (
                                                <span className="font-semibold text-secondary-dark dark:text-secondary">A definir</span>
                                            )}
                                        </td>
                                        {conRelacion && (
                                            <td className="px-3 py-3 text-brandText-muted dark:text-brandText-mutedDark">{relacion(m, usuario)}</td>
                                        )}
                                        <td className="px-3 py-3">
                                            <Estado partible tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
                                            {m.recibido_por && (
                                                <p className="mt-1 text-xs text-brandText-muted dark:text-brandText-mutedDark">
                                                    Acusado por {m.recibido_por.nombre}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="relative z-10 flex items-center justify-end gap-2">
                                                {puedeAcusar(m, usuario) && (
                                                    <Boton tipo="button" variante="contorno" forma="grupo" disabled={acusando} onClick={() => acusar(m)}>
                                                        Acusar recibo
                                                    </Boton>
                                                )}
                                                {puedeAnular(m, usuario) ? (
                                                    <MenuDeAcciones etiqueta={`Más acciones del ticket TK-${m.id}`}>
                                                        <ItemDeMenu icono="block" peligro onClick={() => anular(m)}>
                                                            Anular
                                                        </ItemDeMenu>
                                                    </MenuDeAcciones>
                                                ) : (
                                                    <span className="size-control shrink-0" aria-hidden="true" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={conRelacion ? 7 : 6}>
                                        <EstadoVacio enTarjeta icono="inbox">{PESTANAS.find((p) => p.clave === pestana)?.vacia}</EstadoVacio>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 empty:hidden">
                    <Paginador paginador={movimientos} />
                </div>
            </Tarjeta>

            <ModalConfirmar {...modal} />
        </AppLayout>
    );
}
