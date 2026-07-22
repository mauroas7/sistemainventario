import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Show() {
    return (
        <SidebarLayout>
            <Head title="Auditoría de Ticket" />

            <div className="max-w-6xl">
                {/* Cabecera de la Auditoría */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">
                            Auditoría de Movimiento
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Ticket <span className="font-bold text-gray-700">#TK-1042</span>
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link 
                            href="/patrimonio/dashboard"
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors"
                        >
                            Volver al Dashboard
                        </Link>
                        <button className="px-4 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors flex items-center">
                            {/* Icono de descarga/impresión simulado */}
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                            </svg>
                            Exportar PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda: Datos del Bien y Traslado (Ocupa 2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tarjeta del Bien */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">
                                Identificación del Bien
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">ID Patrimonial</p>
                                    <p className="text-sm font-semibold text-gray-900">3242</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Descripción</p>
                                    <p className="text-sm font-semibold text-gray-900">Notebook Dell Latitude 5420</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Categoría</p>
                                    <p className="text-sm font-medium text-gray-900">Equipamiento Informático</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Estado Físico Reportado</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Requiere Reparación
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta del Traslado */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">
                                Detalles del Movimiento
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Área Origen</p>
                                    <p className="text-sm font-semibold text-gray-900">Área Académica</p>
                                    <p className="text-xs text-gray-500 mt-1">Responsable: Coordinador Académico</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Área Destino</p>
                                    <p className="text-sm font-semibold text-gray-900">TICs (Soporte Técnico)</p>
                                    <p className="text-xs text-gray-500 mt-1">Responsable: Jefe de Sistemas</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Motivo del traslado</p>
                                    <p className="text-sm text-gray-900">Rotura</p>
                                </div>
                                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Observaciones del emisor</p>
                                    <p className="text-sm text-gray-700 italic">"No enciende. Se entrega con cargador original."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Trazabilidad / Custodia (Ocupa 1/3) */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
                        <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-6 border-b pb-2">
                            Cadena de Custodia
                        </h3>
                        
                        {/* Timeline */}
                        <div className="relative border-l-2 border-blue-200 ml-3 space-y-8">
                            
                            {/* Paso 1: Creación */}
                            <div className="relative pl-6">
                                <div className="absolute w-4 h-4 bg-institucional-primario rounded-full -left-[9px] top-1 border-2 border-white shadow-sm"></div>
                                <p className="text-xs text-gray-500">11/07/2026 - 10:20</p>
                                <p className="text-sm font-bold text-gray-900">Ticket Creado</p>
                                <p className="text-xs text-gray-600 mt-1">Generado por: Jefa Académica</p>
                            </div>

                            {/* Paso 2: En tránsito */}
                            <div className="relative pl-6">
                                <div className="absolute w-4 h-4 bg-yellow-400 rounded-full -left-[9px] top-1 border-2 border-white shadow-sm"></div>
                                <p className="text-xs text-gray-500">11/07/2026 - 10:22</p>
                                <p className="text-sm font-bold text-gray-900">Bien en Traslado</p>
                                <p className="text-xs text-gray-600 mt-1">Responsabilidad temporal: Jefa Académica</p>
                            </div>

                            {/* Paso 3: Recepción (Pendiente) */}
                            <div className="relative pl-6">
                                <div className="absolute w-4 h-4 bg-gray-200 rounded-full -left-[9px] top-1 border-2 border-white shadow-sm"></div>
                                <p className="text-xs text-gray-400">Pendiente</p>
                                <p className="text-sm font-bold text-gray-400">Recepción en Destino</p>
                                <p className="text-xs text-gray-400 mt-1">A la espera de: TICs</p>
                            </div>

                        </div>

                        {/* Etiqueta de Estado General */}
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2 text-center">Estado actual del ticket</p>
                            <div className="w-full text-center py-2 bg-yellow-50 text-yellow-700 font-bold text-sm border border-yellow-200 rounded-lg">
                                EN TRÁNSITO
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}