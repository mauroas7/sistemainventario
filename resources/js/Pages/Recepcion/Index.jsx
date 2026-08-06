import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

const TABS = [
    { key: 'pendientes', label: 'Pendientes', estado: 'Pendiente' },
    { key: 'recibidos', label: 'Recibidos', estado: 'Recibido' },
    { key: 'todos', label: 'Todos', estado: null },
];

export default function Bandeja({ movimientos = [], estadoRecibidoId }) {
    const { auth } = usePage().props;
    const [tab, setTab] = useState('pendientes');
    const [processingId, setProcessingId] = useState(null);

    const contar = (estado) =>
        estado ? movimientos.filter((m) => m.estado_movimiento.nombre === estado).length : movimientos.length;

    const tabActual = TABS.find((t) => t.key === tab);
    const filtrados = movimientos.filter(
        (m) => !tabActual.estado || m.estado_movimiento.nombre === tabActual.estado
    );

    const confirmarRecepcion = (movimiento) => {
        setProcessingId(movimiento.id);

        window.axios
            .patch(route('movimientos.update', movimiento.id), {
                estado_movimiento_id: estadoRecibidoId,
                recibido_por: auth.user.id,
                fecha_recepcion: new Date().toISOString(),
            })
            .then(() => {
                router.reload({ only: ['movimientos'] });
            })
            .finally(() => setProcessingId(null));
    };

    return (
        <SidebarLayout>
            <Head title="Bandeja de Recepción" />

            <div className="max-w-6xl">
                {/* Título de la vista */}
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">
                    Flujo de recepcion
                </h2>

                {/* Contenedor Principal */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

                    <p className="text-gray-500 text-sm mb-6">
                        Bandeja para gestionar tickets pendientes y revisar los ya recibidos.
                    </p>

                    {/* Filtros tipo píldora (Tabs) */}
                    <div className="flex items-center space-x-3 mb-6">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTab(t.key)}
                                className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    tab === t.key
                                        ? 'bg-blue-50 text-institucional-primario border-blue-200'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {t.label}
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                        tab === t.key
                                            ? 'bg-white text-institucional-primario border border-blue-200'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {contar(t.estado)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tabla de Tickets */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Ticket</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Bien</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Origen</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Destino</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="pb-3 px-2 text-sm font-semibold text-gray-700 text-center">Accion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtrados.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-6 px-2 text-sm text-gray-500 text-center">
                                            No hay tickets en esta bandeja.
                                        </td>
                                    </tr>
                                )}

                                {filtrados.map((movimiento) => (
                                    <tr key={movimiento.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                                            TK-{movimiento.id}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600">
                                            {movimiento.bien.codigo} - {movimiento.bien.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600">
                                            {movimiento.area_origen.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600">
                                            {movimiento.area_destino.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-500">
                                            {movimiento.estado_movimiento.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            {movimiento.estado_movimiento.nombre === 'Pendiente' ? (
                                                <button
                                                    type="button"
                                                    disabled={processingId === movimiento.id}
                                                    onClick={() => confirmarRecepcion(movimiento)}
                                                    className="px-5 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {processingId === movimiento.id ? 'Confirmando...' : 'Confirmar recepcion'}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}
