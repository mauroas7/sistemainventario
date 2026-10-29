import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Alerta, Boton, Estado, EstadoVacio, Icono, marcoTarjeta, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

const ACCESOS = [
    {
        etiqueta: 'Crear ticket de envío',
        ruta: 'envio.crear',
        icono: 'send',
        descripcion: 'Registrá el traslado de un bien hacia otro sector.',
        roles: [],
    },
    {
        etiqueta: 'Bandeja de recepción',
        ruta: 'recepcion.bandeja',
        icono: 'move_to_inbox',
        descripcion: 'Seguí los movimientos de tu sector, acusá recibo y anulá lo que informaste por error.',
        roles: [],
    },
    {
        etiqueta: 'Control patrimonial',
        ruta: 'patrimonio.dashboard',
        icono: 'monitoring',
        descripcion: 'Consultá y filtrá el historial completo de movimientos.',
        roles: ['admin'],
    },
];

/** Un ticket en las listas del inicio, con sus acciones a la derecha. */
function Renglon({ m, children }) {
    return (
        <li className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="text-sm text-brandText dark:text-brandText-dark">
                    <span className="font-semibold text-primary dark:text-gray-100">TK-{m.id}</span> · {m.bien.codigo} - {m.bien.nombre}
                </p>
                <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">
                    {m.area_origen.nombre} → {m.area_destino.nombre} · {fechaYHora(m.fecha_movimiento)}
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">{children}</div>
        </li>
    );
}

const LISTA = 'divide-y divide-brandText-soft/70 dark:divide-gray-800';

export default function Index({ porAcusar = null, ultimos = null }) {
    const usuario = usePage().props.auth.usuario;
    const accesos = ACCESOS.filter((acceso) => acceso.roles.length === 0 || acceso.roles.includes(usuario.rol));
    const [error, setError] = useState('');

    const acusar = (m) => {
        setError('');
        router.post(route('recepcion.confirmar', { movimiento: m.id }), {}, {
            preserveScroll: true,
            onError: (errores) => setError(Object.values(errores)[0] || 'No se pudo confirmar la recepción'),
        });
    };

    return (
        <AppLayout titulo="Inicio" subtitulo={`Hola, ${usuario.nombre}. Accesos rápidos para operar movimientos de bienes.`}>
            <div className={`mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 ${accesos.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                {accesos.map((acceso) => (
                    <Link
                        key={acceso.ruta}
                        href={route(acceso.ruta)}
                        className={`group flex flex-col justify-between p-6 transition duration-200 hover:-translate-y-0.5 hover:border-secondary ${marcoTarjeta}`}
                    >
                        <div>
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-faint text-primary dark:bg-primary/20 dark:text-gray-100">
                                <Icono nombre={acceso.icono} className="text-2xl" />
                            </span>
                            <h2 className="mt-4 text-base font-semibold text-primary dark:text-gray-100">{acceso.etiqueta}</h2>
                            <p className="mt-1 text-sm text-brandText-muted dark:text-brandText-mutedDark">{acceso.descripcion}</p>
                        </div>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-dark dark:text-secondary">
                            Ir ahora
                            <Icono nombre="arrow_forward" className="text-base transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                ))}
            </div>

            {porAcusar && ultimos && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Tarjeta
                        titulo="Para acusar recibo"
                        icono="task_alt"
                        contador={porAcusar.total}
                        acciones={porAcusar.total > porAcusar.data.length && (
                            <Boton variante="fantasma" forma="grupo" href={route('recepcion.bandeja', { ver: 'por_acusar' })}>
                                Ver todos
                            </Boton>
                        )}
                    >
                        {error && <Alerta tipo="error" className="mb-4">{error}</Alerta>}

                        {porAcusar.data.length > 0 ? (
                            <ul className={LISTA}>
                                {porAcusar.data.map((m) => (
                                    <Renglon key={m.id} m={m}>
                                        <Boton variante="fantasma" forma="grupo" icono="visibility" href={route('recepcion.show', { movimiento: m.id })}>
                                            Ver
                                        </Boton>
                                        <Boton tipo="button" variante="contorno" forma="grupo" icono="task_alt" onClick={() => acusar(m)}>
                                            Acusar recibo
                                        </Boton>
                                    </Renglon>
                                ))}
                            </ul>
                        ) : (
                            <EstadoVacio enTarjeta icono="inbox">No tenés bienes para acusar recibo.</EstadoVacio>
                        )}
                    </Tarjeta>

                    <Tarjeta
                        titulo="Últimos tickets"
                        icono="history"
                        acciones={ultimos.data.length > 0 && (
                            <Boton variante="fantasma" forma="grupo" href={route('recepcion.bandeja', { ver: 'todos' })}>
                                Ver la bandeja
                            </Boton>
                        )}
                    >
                        {ultimos.data.length > 0 ? (
                            <ul className={LISTA}>
                                {ultimos.data.map((m) => (
                                    <Renglon key={m.id} m={m}>
                                        <Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
                                        <Boton
                                            variante="fantasma"
                                            forma="grupo"
                                            tamano="icono"
                                            icono="visibility"
                                            href={route('recepcion.show', { movimiento: m.id })}
                                            aria-label={`Ver el ticket TK-${m.id}`}
                                        />
                                    </Renglon>
                                ))}
                            </ul>
                        ) : (
                            <EstadoVacio enTarjeta icono="history">Todavía no hay tickets.</EstadoVacio>
                        )}
                    </Tarjeta>
                </div>
            )}
        </AppLayout>
    );
}
