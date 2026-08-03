import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ClockIcon, CheckCircleIcon, ClipboardDocumentListIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { estadoMovimientoClase } from '@/utils/format';

export default function Bandeja({ movimientos: initialMovimientos = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [movimientos] = useState(initialMovimientos);
    const [filtro, setFiltro] = useState('informados');

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

    function confirmarRecepcion(movimientoId) {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch(`/recepcion/confirmar/${movimientoId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token || '',
            },
            credentials: 'same-origin',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json().catch(() => null);
                    throw new Error(data?.message || 'No se pudo confirmar la recepción');
                }

                window.location.reload();
            })
            .catch((error) => {
                alert(error.message || 'No se pudo confirmar la recepción');
            });
    }

    function cancelarRecepcion(movimientoId) {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch(`/recepcion/cancelar/${movimientoId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token || '',
            },
            credentials: 'same-origin',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json().catch(() => null);
                    throw new Error(data?.message || 'No se pudo cancelar el ticket');
                }

                window.location.reload();
            })
            .catch((error) => {
                alert(error.message || 'No se pudo cancelar el ticket');
            });
    }

    const visibles = movimientos.filter((m) => {
        if (filtro === 'todos') return true;
        if (filtro === 'registrados') return ['Registrado', 'Cerrado'].includes(m.estado_movimiento?.nombre);
        return m.estado_movimiento?.nombre === 'Informado';
    });

    const resumen = useMemo(() => {
        const contar = (...estados) => movimientos.filter(m => estados.includes(m.estado_movimiento?.nombre)).length;

        return {
            informados: contar('Informado'),
            registrados: contar('Registrado', 'Cerrado'),
            anulados: contar('Anulado'),
            total: movimientos.length,
        };
    }, [movimientos]);

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
                                <p className="mt-1 text-2xl font-bold text-green-700">{resumen.registrados}</p>
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
                            onClick={() => setFiltro('informados')}
                            className={`rounded-full px-4 py-2 text-sm font-medium ${filtro === 'informados' ? 'bg-blue-50 text-institucional-primario border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            Informados
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro('registrados')}
                            className={`rounded-full px-4 py-2 text-sm font-medium ${filtro === 'registrados' ? 'bg-blue-50 text-institucional-primario border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            Registrados
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltro('todos')}
                            className={`rounded-full px-4 py-2 text-sm font-medium ${filtro === 'todos' ? 'bg-blue-50 text-institucional-primario border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            Todos
                        </button>
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
                </div>
            </div>
        </SidebarLayout>
    );
}
