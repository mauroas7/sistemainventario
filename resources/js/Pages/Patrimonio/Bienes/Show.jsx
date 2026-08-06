import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

function formatFecha(iso) {
    if (!iso) return '—';
    const fecha = new Date(iso);
    return `${fecha.toLocaleDateString('es-AR')} - ${fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`;
}

export default function Show({ bien, movimientos = [] }) {
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
                            Bien <span className="font-bold text-gray-700">{bien.codigo} - {bien.nombre}</span>
                        </p>
                    </div>
                    <Link
                        href={route('patrimonio.dashboard')}
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
                                    <p className="text-xs text-gray-500">Código</p>
                                    <p className="text-sm font-bold text-gray-900">{bien.codigo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Nombre</p>
                                    <p className="text-sm text-gray-900">{bien.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Descripción</p>
                                    <p className="text-sm text-gray-700">{bien.descripcion || 'Sin descripción'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Área responsable</p>
                                    <p className="text-sm text-gray-900">{bien.area.nombre}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Ubicación Actual</p>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <p className="text-sm font-bold text-gray-900">{bien.ubicacion_actual.nombre}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Estado</p>
                                <p className="text-sm font-bold text-gray-900">{bien.estado.nombre}</p>
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

                        {movimientos.length === 0 && (
                            <p className="text-sm text-gray-500">Este bien todavía no tiene movimientos registrados.</p>
                        )}

                        <div className="space-y-6">
                            {movimientos.map((movimiento, index) => (
                                <div key={movimiento.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center text-institucional-primario shadow-sm z-10">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                        </div>
                                        {index < movimientos.length - 1 && (
                                            <div className="w-px h-full bg-gray-200 mt-2"></div>
                                        )}
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-xs text-gray-500 mb-1">{formatFecha(movimiento.fecha_movimiento)}</p>
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{movimiento.tipo_movimiento.nombre}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        De <span className="font-medium text-gray-800">{movimiento.area_origen.nombre}</span> a{' '}
                                                        <span className="font-medium text-gray-800">{movimiento.area_destino.nombre}</span>
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {movimiento.estado_movimiento.nombre}
                                                </span>
                                            </div>
                                            <div className="mt-3 text-xs text-gray-500">
                                                Vinculado al{' '}
                                                <Link
                                                    href={route('patrimonio.tickets.show', movimiento.id)}
                                                    className="text-institucional-primario hover:underline font-medium"
                                                >
                                                    Ticket #TK-{movimiento.id}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
