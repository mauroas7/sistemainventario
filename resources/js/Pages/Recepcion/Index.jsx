import React from 'react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Bandeja() {
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
                        <button className="flex items-center px-4 py-1.5 bg-blue-50 text-institucional-primario border border-blue-200 rounded-full text-sm font-medium">
                            Pendientes 
                            <span className="ml-2 bg-white text-institucional-primario border border-blue-200 px-2 py-0.5 rounded-full text-xs font-bold">
                                0
                            </span>
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                            Recibidos 
                            <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">
                                0
                            </span>
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                            Todos 
                            <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">
                                0
                            </span>
                        </button>
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
                                {/* Fila de ejemplo (TK-1042) */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                                        TK-1042
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-600">
                                        3242 - Notebook Dell Latitude
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-600">
                                        Area Academica
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-600">
                                        TICs
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-500">
                                        En traslado
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        <button 
                                            type="button" 
                                            className="px-5 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors whitespace-nowrap"
                                        >
                                            Confirmar recepcion
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}