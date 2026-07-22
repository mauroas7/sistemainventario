import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Index() {
    return (
        <SidebarLayout>
            <Head title="Directorio de Bienes" />

            <div className="max-w-7xl">
                {/* Cabecera y Acción Principal */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">
                            Directorio de Bienes
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Gestión y consulta del inventario general del hospital.
                        </p>
                    </div>
                    <button className="px-5 py-2.5 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Alta de Bien
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    
                    {/* Barra de Búsqueda y Filtros */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="w-full md:w-1/3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Buscar por ID, nombre o S/N..." 
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-institucional-primario focus:border-institucional-primario sm:text-sm"
                            />
                        </div>

                        <div className="flex space-x-3 w-full md:w-auto">
                            <select className="border-gray-300 rounded-lg text-sm focus:ring-institucional-primario focus:border-institucional-primario text-gray-600">
                                <option>Todas las categorías</option>
                                <option>Equipamiento Informático</option>
                                <option>Mobiliario</option>
                                <option>Equipamiento Médico</option>
                            </select>
                            <select className="border-gray-300 rounded-lg text-sm focus:ring-institucional-primario focus:border-institucional-primario text-gray-600">
                                <option>Cualquier estado</option>
                                <option>Operativo</option>
                                <option>En Reparación</option>
                                <option>De Baja</option>
                            </select>
                        </div>
                    </div>

                    {/* Tabla de Directorio */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="py-3 px-4">ID Patrimonial</th>
                                    <th className="py-3 px-4">Descripción del Bien</th>
                                    <th className="py-3 px-4">Categoría</th>
                                    <th className="py-3 px-4">Ubicación Actual</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                
                                {/* Fila 1 */}
                                <tr className="hover:bg-blue-50/50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-institucional-primario">3242</td>
                                    <td className="py-3 px-4 text-gray-800 font-medium">Notebook Dell Latitude 5420</td>
                                    <td className="py-3 px-4 text-gray-500">Equipamiento Informático</td>
                                    <td className="py-3 px-4 text-gray-600">
                                        <div className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                            En tránsito (hacia TICs)
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                            Req. Reparación
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Link 
                                            href="/patrimonio/bienes/show" 
                                            className="text-institucional-primario hover:text-blue-700 font-medium text-xs hover:underline"
                                        >
                                            Ver historial
                                        </Link>
                                    </td>
                                </tr>

                                {/* Fila 2 */}
                                <tr className="hover:bg-blue-50/50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-institucional-primario">1988</td>
                                    <td className="py-3 px-4 text-gray-800 font-medium">Balanza digital pediátrica</td>
                                    <td className="py-3 px-4 text-gray-500">Equipamiento Médico</td>
                                    <td className="py-3 px-4 text-gray-600">
                                        <div className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                            Biomédica
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            Operativo
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Link 
                                            href="#" 
                                            className="text-institucional-primario hover:text-blue-700 font-medium text-xs hover:underline"
                                        >
                                            Ver historial
                                        </Link>
                                    </td>
                                </tr>

                                {/* Fila 3 */}
                                <tr className="hover:bg-blue-50/50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-institucional-primario">4510</td>
                                    <td className="py-3 px-4 text-gray-800 font-medium">Escritorio Gerencial en L</td>
                                    <td className="py-3 px-4 text-gray-500">Mobiliario</td>
                                    <td className="py-3 px-4 text-gray-600">
                                        <div className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                            Dirección Médica
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            Operativo
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Link 
                                            href="#" 
                                            className="text-institucional-primario hover:text-blue-700 font-medium text-xs hover:underline"
                                        >
                                            Ver historial
                                        </Link>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    
                    {/* Paginación Simular */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Mostrando <span className="font-medium text-gray-900">1</span> a <span className="font-medium text-gray-900">3</span> de <span className="font-medium text-gray-900">5,420</span> bienes
                        </span>
                        <div className="flex space-x-1">
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-400 bg-white cursor-not-allowed">Anterior</button>
                            <button className="px-3 py-1 border border-institucional-primario rounded text-sm text-white bg-institucional-primario">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50">3</button>
                            <span className="px-2 py-1 text-gray-500">...</span>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50">Siguiente</button>
                        </div>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}