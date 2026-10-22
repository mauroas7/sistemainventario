import { router, usePage } from '@inertiajs/react';
import {
    Boton,
    cuerpoTabla,
    encabezadoTabla,
    Estado,
    EstadoVacio,
    Metrica,
    ModalConfirmar,
    Paginador,
    renglonTabla,
    Tarjeta,
    useConfirmacion,
} from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { puedeAcusar, puedeAnular, relacion } from '@/utils/movimientos';

const PESTANAS = [
    { clave: 'informados', etiqueta: 'Informados' },
    { clave: 'registrados', etiqueta: 'Registrados' },
    { clave: 'todos', etiqueta: 'Todos' },
];

const avisoDeError = (mensajePorDefecto) => (errores) => alert(Object.values(errores)[0] || mensajePorDefecto);

export default function Bandeja({ movimientos, pestana = 'informados', resumen }) {
    const usuario = usePage().props.auth.usuario;
    const { confirmar, props: modal } = useConfirmacion();

    // El filtrado y el conteo los hace la base: cada pestaña es una visita.
    const irA = (clave) => router.get(route('recepcion.bandeja'), { estado: clave }, { preserveScroll: true });

    const acusar = (m) => {
        router.post(route('recepcion.confirmar', { movimiento: m.id }), {}, {
            preserveScroll: true,
            onError: avisoDeError('No se pudo confirmar la recepción'),
        });
    };

    const anular = (m) => {
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
        <AppLayout
            titulo="Flujo de recepción"
            subtitulo="Movimientos informados que involucran a tu sector. Lo que queda abierto es el trámite de Gestión de Bienes: la carga en Diaguita y la firma de la ficha."
        >
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metrica valor={resumen.informados} etiqueta="A registrar en Diaguita" icono="schedule" tono="aviso" />
                {/* Agrupa los dos estados en que el trámite ya salió del circuito, como la pestaña. */}
                <Metrica valor={resumen.registrados + resumen.cerrados} etiqueta="Registrados" icono="check_circle" tono="exito" />
                <Metrica valor={resumen.total} etiqueta="Total" icono="list_alt" />
                <Metrica valor={resumen.anulados} etiqueta="Anulados" icono="cancel" tono="error" />
            </div>

            <Tarjeta
                titulo="Movimientos"
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
                        {etiqueta}
                    </Boton>
                ))}
            >
                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[60rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">Ticket</th>
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
                                    <td colSpan={7}>
                                        <EstadoVacio enTarjeta icono="inbox">No hay movimientos para este filtro.</EstadoVacio>
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
