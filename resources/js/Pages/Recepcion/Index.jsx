import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Alerta,
    Boton,
    cuerpoTabla,
    encabezadoTabla,
    Estado,
    EstadoVacio,
    ModalConfirmar,
    Paginador,
    renglonTabla,
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
    admin: 'Los tickets de todo el hospital.',
    coordinador: 'Los tickets que salen de tu sector o llegan a él.',
    usuario: 'Los tickets que informaste y los de bienes que estuvieron o quedan a tu cargo.',
};

export default function Bandeja({ movimientos, pestana = 'todos', contadores }) {
    const usuario = usePage().props.auth.usuario;
    const { confirmar, props: modal } = useConfirmacion();
    const [error, setError] = useState('');

    const avisoDeError = (mensajePorDefecto) => (errores) => setError(Object.values(errores)[0] || mensajePorDefecto);

    // El filtrado y el conteo los hace la base: cada pestaña es una visita.
    const irA = (clave) => router.get(route('recepcion.bandeja'), { ver: clave }, { preserveScroll: true });

    const acusar = (m) => {
        setError('');
        router.post(route('recepcion.confirmar', { movimiento: m.id }), {}, {
            preserveScroll: true,
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
            <Tarjeta
                titulo="Tickets"
                icono="move_to_inbox"
                contador={movimientos.total}
                acciones={PESTANAS.map(({ clave, etiqueta }) => (
                    <Boton
                        key={clave}
                        tipo="button"
                        forma="grupo"
                        variante={pestana === clave ? 'primario' : 'fantasma'}
                        aria-pressed={pestana === clave}
                        onClick={() => irA(clave)}
                    >
                        {etiqueta} ({contadores[clave]})
                    </Boton>
                ))}
            >
                {error && <Alerta tipo="error" className="mb-4">{error}</Alerta>}

                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[68rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">Ticket</th>
                                <th className="px-3 pb-2 font-semibold">Fecha</th>
                                <th className="px-3 pb-2 font-semibold">Bien</th>
                                <th className="px-3 pb-2 font-semibold">Traslado</th>
                                <th className="px-3 pb-2 font-semibold">Responsable</th>
                                <th className="px-3 pb-2 font-semibold">Relación</th>
                                <th className="px-3 pb-2 font-semibold">Estado</th>
                                <th className="w-px px-5 pb-2 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={cuerpoTabla}>
                            {movimientos.data.length > 0 ? (
                                movimientos.data.map((m) => (
                                    <tr key={m.id} className={renglonTabla}>
                                        <td className="px-5 py-3 font-semibold text-primary dark:text-gray-100">TK-{m.id}</td>
                                        <td className="whitespace-nowrap px-3 py-3">{fechaYHora(m.fecha_movimiento)}</td>
                                        <td className="min-w-56 px-3 py-3">
                                            <p className="text-brandText dark:text-brandText-dark">
                                                <span className="font-semibold">{m.bien.codigo}</span> - {m.bien.nombre}
                                            </p>
                                            <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">
                                                Diaguita: {m.bien.numero_diaguita || 'sin cargar'}
                                            </p>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">{m.area_origen.nombre} → {m.area_destino.nombre}</td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            {m.responsable_anterior?.nombre || '—'} →{' '}
                                            {m.responsable_nuevo ? (
                                                <span className="font-semibold">{m.responsable_nuevo.nombre}</span>
                                            ) : (
                                                <span className="font-semibold text-secondary-dark dark:text-secondary">A definir</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-brandText-muted dark:text-brandText-mutedDark">{relacion(m, usuario)}</td>
                                        <td className="px-3 py-3">
                                            <Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
                                            {m.recibido_por && (
                                                <p className="mt-1 text-xs text-brandText-muted dark:text-brandText-mutedDark">
                                                    Acusado por {m.recibido_por.nombre}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Boton variante="fantasma" forma="grupo" icono="visibility" href={route('recepcion.show', { movimiento: m.id })}>
                                                    Ver
                                                </Boton>
                                                {puedeAcusar(m, usuario) && (
                                                    <Boton tipo="button" variante="contorno" forma="grupo" icono="task_alt" onClick={() => acusar(m)}>
                                                        Acusar recibo
                                                    </Boton>
                                                )}
                                                {puedeAnular(m, usuario) && (
                                                    <Boton tipo="button" variante="peligro" forma="grupo" icono="block" onClick={() => anular(m)}>
                                                        Anular
                                                    </Boton>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8}>
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
