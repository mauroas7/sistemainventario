import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

function formatFecha(iso) {
    if (!iso) return '—';
    const fecha = new Date(iso);
    const dia = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
    const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${dia} ${hora}`;
}

export default function Dashboard({ kpis = { total: 0, pendientes: 0, recibidos: 0 }, ultimosTickets = [] }) {
    return (
        <SidebarLayout>
            <Head title="Control Patrimonial" />

            <div className="max-w-7xl">
                {/* Título de la vista */}
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">
                    Control patrimonial
                </h2>

                {/* Sección 1: Filtros del Dashboard */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-bold text-institucional-primario mb-4">
                        Filtros del dashboard
                    </h3>

                    <form className="space-y-4">
                        {/* Fila 1: Sector y Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Sector (origen o destino)
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>Todos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Estado
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>Todos</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 2: Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Fila 3: Búsqueda libre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Bien (codigo o nombre)
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: NB001 o Notebook Dell"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Fila 4: Botones */}
                        <div className="flex space-x-4 pt-2">
                            <button
                                type="button"
                                className="px-6 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors"
                            >
                                Aplicar filtros
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                Limpiar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sección 2: Tarjetas de Resumen (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Total de movimientos</h4>
                        <p className="text-4xl font-bold text-institucional-primario">{kpis.total}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Pendientes de recepcion</h4>
                        <p className="text-4xl font-bold text-institucional-primario">{kpis.pendientes}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Recibidos</h4>
                        <p className="text-4xl font-bold text-institucional-primario">{kpis.recibidos}</p>
                    </div>
                </div>

                {/* Sección 3: Tabla de Últimos Tickets */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-institucional-primario mb-4">
                        Ultimos tickets
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Nro</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Bien</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Origen</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Destino</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Estado</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Responsable</th>
                                    <th className="pb-3 px-2 text-sm font-bold text-institucional-primario">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ultimosTickets.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-6 px-2 text-sm text-gray-500 text-center">
                                            Todavía no hay movimientos registrados.
                                        </td>
                                    </tr>
                                )}

                                {ultimosTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                                            <Link
                                                href={route('patrimonio.tickets.show', ticket.id)}
                                                className="text-institucional-primario hover:underline"
                                            >
                                                TK-{ticket.id}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600">
                                            {ticket.bien.codigo} - {ticket.bien.nombre}
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-600">{ticket.area_origen.nombre}</td>
                                        <td className="py-4 px-2 text-sm text-gray-600">{ticket.area_destino.nombre}</td>
                                        <td className="py-4 px-2 text-sm text-gray-600">{ticket.estado_movimiento.nombre}</td>
                                        <td className="py-4 px-2 text-sm text-gray-600">{ticket.creado_por.nombre}</td>
                                        <td className="py-4 px-2 text-sm text-gray-600">{formatFecha(ticket.fecha_movimiento)}</td>
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
