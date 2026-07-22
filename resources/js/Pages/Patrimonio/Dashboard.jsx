import React from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Dashboard() {
    return (
        <SidebarLayout>
            <Head title="Control Patrimonial" />

            <div className="max-w-7xl">
                {/* Título de la vista */}
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">
                    Control patrimonial (Silvana)
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
                                placeholder="Ej: 3242 o Notebook Dell" 
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
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Abiertos</h4>
                        <p className="text-4xl font-bold text-institucional-primario">2</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Pendientes recepcion</h4>
                        <p className="text-4xl font-bold text-institucional-primario">1</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-institucional-primario mb-4">Recibidos en destino</h4>
                        <p className="text-4xl font-bold text-institucional-primario">1</p>
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
                                {/* Fila 1 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">TK-1042</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">3242 - Notebook Dell Latitude</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Area Academica</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">TICs</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">En traslado</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Jefa Academica (hasta recepcion)</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">11/07 10:22</td>
                                </tr>
                                {/* Fila 2 */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">TK-1041</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">1988 - Balanza digital</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Consultorio 10</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Biomedica</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Recibido en destino</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">Responsable de Biomedica</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">11/07 09:40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SidebarLayout>
    );
}