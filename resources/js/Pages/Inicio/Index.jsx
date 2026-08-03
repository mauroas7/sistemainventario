import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import {
    PaperAirplaneIcon,
    InboxArrowDownIcon,
    ChartBarIcon,
    ArrowRightIcon,
} from '@heroicons/react/20/solid';

const ICONOS = {
    '/envio/crear-ticket': PaperAirplaneIcon,
    '/recepcion/bandeja': InboxArrowDownIcon,
    '/patrimonio/dashboard': ChartBarIcon,
};

export default function Index() {
    const { auth } = usePage().props;
    const role = auth?.user?.rol;

    const actions = [
        {
            label: 'Crear ticket de envío',
            href: '/envio/crear-ticket',
            descripcion: 'Registrá el traslado de un bien hacia otro sector.',
            roles: ['admin', 'coordinador', 'usuario'],
            destacado: true,
        },
        {
            label: 'Bandeja de recepción',
            href: '/recepcion/bandeja',
            descripcion: 'Confirmá o rechazá los movimientos que llegan a tu sector.',
            roles: ['admin', 'coordinador', 'usuario'],
        },
        {
            label: 'Control patrimonial',
            href: '/patrimonio/dashboard',
            descripcion: 'Consultá y filtrá el historial completo de movimientos.',
            roles: ['admin'],
        },
    ].filter(item => item.roles.includes(role));

    const pasos = [
        { numero: '1', texto: 'Abrí la sección que corresponde a tu rol.' },
        { numero: '2', texto: 'Creá o recibí un movimiento desde las vistas operativas.' },
        { numero: '3', texto: 'Si sos admin, revisá el control patrimonial.' },
    ];

    return (
        <SidebarLayout>
            <Head title="Inicio" />

            <div className="max-w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-institucional-primario">Inicio</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Bienvenido/a, {auth?.user?.name || 'usuario'}. Accesos rápidos para operar movimientos de bienes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {actions.map((action) => {
                        const Icono = ICONOS[action.href];
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-colors ${
                                    action.destacado
                                        ? 'border-institucional-primario/20 bg-institucional-primario text-white hover:bg-blue-900'
                                        : 'border-gray-200 bg-white text-gray-900 hover:border-institucional-primario/40 hover:bg-blue-50/40'
                                }`}
                            >
                                <div>
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                        action.destacado ? 'bg-white/15 text-white' : 'bg-institucional-primario/10 text-institucional-primario'
                                    }`}>
                                        {Icono && <Icono className="h-5 w-5" />}
                                    </span>
                                    <h3 className={`mt-4 text-base font-bold ${action.destacado ? 'text-white' : 'text-gray-900'}`}>{action.label}</h3>
                                    <p className={`mt-1 text-sm ${action.destacado ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {action.descripcion}
                                    </p>
                                </div>
                                <div className={`mt-5 inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    action.destacado ? 'text-white' : 'text-institucional-primario'
                                }`}>
                                    Ir ahora
                                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-5">
                        Flujo de envío
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pasos.map((paso) => (
                            <div key={paso.numero} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-institucional-secundario text-xs font-bold text-institucional-primario">
                                    {paso.numero}
                                </span>
                                <p className="text-sm text-gray-700">{paso.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
