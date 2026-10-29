import { Link, usePage } from '@inertiajs/react';
import { Icono, marcoTarjeta, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';

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

const PASOS = [
    'Abrí la sección que corresponde a tu rol.',
    'Creá o recibí un movimiento desde las vistas operativas.',
    'Si sos admin, revisá el control patrimonial.',
];

export default function Index() {
    const usuario = usePage().props.auth.usuario;
    const accesos = ACCESOS.filter((acceso) => acceso.roles.length === 0 || acceso.roles.includes(usuario.rol));

    return (
        <AppLayout titulo="Inicio" subtitulo={`Hola, ${usuario.nombre}. Accesos rápidos para operar movimientos de bienes.`}>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <Tarjeta titulo="Flujo de envío" icono="route">
                <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {PASOS.map((paso, indice) => (
                        <li key={paso} className="flex items-start gap-3 rounded-xl bg-canvas p-4 dark:bg-white/5">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-primary">
                                {indice + 1}
                            </span>
                            <p className="text-sm text-brandText dark:text-brandText-dark">{paso}</p>
                        </li>
                    ))}
                </ol>
            </Tarjeta>
        </AppLayout>
    );
}
