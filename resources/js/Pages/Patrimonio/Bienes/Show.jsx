import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Show() {
    return (
        <SidebarLayout>
            <Head title="Historial del Bien" />

            <div className="max-w-6xl">
                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">
                            Ficha y Registro Histórico
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Bien <span className="font-bold text-gray-700">#3242 - Notebook Dell Latitude</span>
                        </p>
                    </div>
                    <Link 
                        href="/patrimonio/dashboard"
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        Volver al Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda: Ficha Técnica (1/3) */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">
                                Datos del Activo
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500">ID Patrimonial</p>
                                    <p className="text-sm font-bold text-gray-900">3242</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Categoría</p>
                                    <p className="text-sm text-gray-900">Equipamiento Informático</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Número de Serie (S/N)</p>
                                    <p className="text-sm font-mono text-gray-700">DL-9843-XX2</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fecha de Alta</p>
                                    <p className="text-sm text-gray-900">15/03/2023</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Ubicación Actual</p>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <p className="text-sm font-bold text-gray-900">TICs (Soporte Técnico)</p>
                                </div>
                            </div>
                        </div>

                        {/* Código QR (Simulación) */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold">Etiqueta QR</p>
                            <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <button className="text-xs text-institucional-primario font-medium hover:underline">Imprimir etiqueta</button>
                        </div>
                    </div>

                    {/* Columna Derecha: Historial de Movimientos (2/3) */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-6 border-b pb-2">
                            Registro de Movimientos (Log)
                        </h3>

                        <div className="space-y-6">
                            
                            {/* Movimiento 3 (El más reciente) */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center text-institucional-primario shadow-sm z-10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                    </div>
                                    <div className="w-px h-full bg-gray-200 mt-2"></div>
                                </div>
                                <div className="pb-6">
                                    <p className="text-xs text-gray-500 mb-1">11/07/2026 - 10:22 hs</p>
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Traslado por Reparación</p>
                                                <p className="text-sm text-gray-600 mt-1">De <span className="font-medium text-gray-800">Área Académica</span> a <span className="font-medium text-gray-800">TICs</span></p>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                Completado
                                            </span>
                                        </div>
                                        <div className="mt-3 text-xs text-gray-500">
                                            Vinculado al <a href="#" className="text-institucional-primario hover:underline font-medium">Ticket #TK-1042</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Movimiento 2 */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm z-10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    </div>
                                    <div className="w-px h-full bg-gray-200 mt-2"></div>
                                </div>
                                <div className="pb-6">
                                    <p className="text-xs text-gray-500 mb-1">10/05/2024 - 09:15 hs</p>
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                        <p className="text-sm font-bold text-gray-900">Asignación Inicial</p>
                                        <p className="text-sm text-gray-600 mt-1">El bien fue asignado permanentemente a <span className="font-medium text-gray-800">Área Académica</span>.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Movimiento 1 (Origen) */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-600 shadow-sm z-10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">15/03/2023 - 11:00 hs</p>
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                        <p className="text-sm font-bold text-gray-900">Alta en Patrimonio</p>
                                        <p className="text-sm text-gray-600 mt-1">El bien ingresó al sistema. Ubicación inicial: <span className="font-medium text-gray-800">Depósito Central</span>.</p>
                                        <p className="text-xs text-gray-500 mt-2">Registrado por: Admin Patrimonio</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}