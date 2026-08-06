import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ClockIcon, CheckCircleIcon, ClipboardDocumentListIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { estadoMovimientoClase } from '@/utils/format';
import axios from 'axios';

const PESTANAS = [
    { clave: 'informados', etiqueta: 'Informados' },
    { clave: 'registrados', etiqueta: 'Registrados' },
    { clave: 'todos', etiqueta: 'Todos' },
];

export default function Bandeja({
    movimientos = [],
    pestana = 'informados',
    paginacion = { pagina: 1, ultima_pagina: 1, total: 0 },
    resumen = { informados: 0, registrados: 0, cerrados: 0, anulados: 0, total: 0 },
}) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    // El filtrado y el conteo los hace la base: antes se traían todos los movimientos
    // del hospital y se filtraban en el navegador.
    function irA(clave, pagina = 1) {
        router.get(route('recepcion.bandeja'), { estado: clave, page: pagina }, {
            preserveScroll: true,
            preserveState: false,
        });
    }

    function relacion(m) {
        if (user.rol === 'admin') return 'Admin';
        if (String(m.area_origen?.id) === String(user.area_id)) return 'Enviado';
        if (String(m.area_destino?.id) === String(user.area_id)) return 'A recibir';
        return '—';
    }

    function estadoEtiqueta(m) {
        return m.estado_movimiento?.nombre || '—';
    }

    function estadoClase(m) {
        return estadoMovimientoClase(m.estado_movimiento?.nombre);
    }

    // El acuse es opcional y lo da quien quedó a cargo del bien (o su área).
    function puedeConfirmar(m) {
        if (m.estado_movimiento?.nombre === 'Anulado' || m.recibido_por) return false;

        return user.rol === 'admin'
            || String(m.responsable_nuevo?.id) === String(user.id)
            || String(m.area_destino?.id) === String(user.area_id);
    }

    // Anular solo mientras Patrimonio no lo haya volcado a Diaguita.
    function puedeCancelar(m) {
        return m.estado_movimiento?.nombre === 'Informado'
            && (user.rol === 'admin' || String(m.creado_por?.id) === String(user.id));
    }

    // Estas acciones van por axios y no por fetch(): axios manda el token CSRF leyéndolo
    // de la cookie XSRF-TOKEN, que el servidor mantiene al día. El <meta name="csrf-token">
    // se renderiza una sola vez y queda viejo apenas el login rota la sesión, así que un
    // fetch() que lo leyera terminaba siempre en 419. Se usa route() porque devuelve una
    // URL absoluta y evita el baseURL '/api' que tiene axios configurado por defecto.
    function confirmarRecepcion(movimientoId) {
        axios.post(route('recepcion.confirmar', { movimiento: movimientoId }))
            .then(() => window.location.reload())
            .catch((error) => {
                alert(error.response?.data?.message || 'No se pudo confirmar la recepción');
            });
    }

    function cancelarRecepcion(movimientoId) {
        axios.post(route('recepcion.cancelar', { movimiento: movimientoId }))
            .then(() => window.location.reload())
            .catch((error) => {
                alert(error.response?.data?.message || 'No se pudo cancelar el ticket');
            });
    }

    // La página ya viene filtrada del servidor.
    const visibles = movimientos;

    return (
        <SidebarLayout>
            <Head title="Bandeja de Recepción" />
            <div className="max-w-full">
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">Flujo de recepción</h2>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <p className="text-gray-500 text-sm mb-6">
                        Movimientos informados que involucran a tu sector. El traslado ya está registrado;
                        lo que queda abierto es el trámite de Gestión de Bienes (carga en Diaguita y firma de la ficha).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700">
                                <ClockIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">A registrar en Diaguita</p>
                                <p className="mt-1 text-2xl font-bold text-amber-700">{resumen.informados}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                                <CheckCircleIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Registrados</p>
                                {/* La tarjeta y la pestaña "Registrados" agrupan los dos
                                    estados en que el trámite ya salió del circuito. */}
                                <p className="mt-1 text-2xl font-bold text-green-700">{resumen.registrados + resumen.cerrados}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600">
                                <ClipboardDocumentListIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Total</p>
                                <p className="mt-1 text-2xl font-bold text-gray-800">{resumen.total}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-700">
                                <XCircleIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Anulados</p>
                                <p className="mt-1 text-2xl font-bold text-red-700">{resumen.anulados}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => irA(PESTANAS[0].clave)}
                            className={`rounded-full px-4 py-2 text-sm font-medium ${pestana === PESTANAS[0].clave ? 'bg-blue-50 text-institucional-primario border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            {PESTANAS[0].etiqueta}
                        </button>
                        {PESTANAS.slice(1).map(({ clave, etiqueta }) => (
                            <button
                                key={clave}
                                type="button"
                                onClick={() => irA(clave)}
                                className={`rounded-full px-4 py-2 text-sm font-medium ${pestana === clave ? 'bg-blue-50 text-institucional-primario border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                            >
                                {etiqueta}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Ticket</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Bien</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Traslado</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Responsable</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Relación</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700 text-center">Detalle</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {visibles.map(m => (
                                    <tr key={m.id}>
                                        <td className="py-4 px-2 text-sm text-gray-600 font-medium">TK-{m.id}</td>
                                        <td className="py-4 px-2 text-sm text-gray-600">
                                            <span className="font-medium text-gray-700">{m.bien?.codigo ?? ''}</span> - {m.bien?.nombre ?? ''}
                                            <span className="block text-xs text-gray-400">
                                                Diaguita: {m.bien?.numero_diaguita || 'sin cargar'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600 whitespace-nowrap">
                                            {m.area_origen?.nombre} → {m.area_destino?.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600 whitespace-nowrap">
                                            {m.responsable_anterior?.nombre || '—'} → {m.responsable_nuevo?.nombre
                                                ? <span className="font-medium text-gray-800">{m.responsable_nuevo.nombre}</span>
                                                : <span className="font-medium text-amber-700">A definir</span>}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-500">{relacion(m)}</td>
                                        <td className="py-4 px-2 text-sm">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estadoClase(m)}`}>
                                                {estadoEtiqueta(m)}
                                            </span>
                                            {m.recibido_por && (
                                                <span className="block mt-1 text-xs text-gray-400">Acusado por {m.recibido_por.nombre}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <Link
                                                href={route('recepcion.show', { movimiento: m.id })}
                                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                            >
                                                Ver
                                            </Link>
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {puedeConfirmar(m) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmarRecepcion(m.id)}
                                                        className="rounded-lg bg-institucional-primario px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
                                                    >
                                                        Acusar recibo
                                                    </button>
                                                )}
                                                {puedeCancelar(m) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => cancelarRecepcion(m.id)}
                                                        className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-red-600 border border-red-200 shadow-sm transition-colors hover:bg-red-50"
                                                    >
                                                        Anular
                                                    </button>
                                                )}
                                                {!puedeConfirmar(m) && !puedeCancelar(m) && (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {visibles.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                                            No hay movimientos para este filtro.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paginacion.ultima_pagina > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                            <p className="text-sm text-gray-500">
                                Página <span className="font-medium text-gray-900">{paginacion.pagina}</span> de{' '}
                                <span className="font-medium text-gray-900">{paginacion.ultima_pagina}</span>
                                <span className="text-gray-400"> · {paginacion.total} movimientos</span>
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={paginacion.pagina <= 1}
                                    onClick={() => irA(pestana, paginacion.pagina - 1)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Anterior
                                </button>
                                <button
                                    type="button"
                                    disabled={paginacion.pagina >= paginacion.ultima_pagina}
                                    onClick={() => irA(pestana, paginacion.pagina + 1)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
