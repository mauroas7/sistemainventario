import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

const ESTADO_BANNER = {
    Pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Recibido: 'bg-green-50 text-green-700 border-green-200',
    Finalizado: 'bg-green-50 text-green-700 border-green-200',
    Cancelado: 'bg-red-50 text-red-700 border-red-200',
    Rechazado: 'bg-red-50 text-red-700 border-red-200',
};

function formatFecha(iso) {
    if (!iso) return '—';
    const fecha = new Date(iso);
    return `${fecha.toLocaleDateString('es-AR')} - ${fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function Show({ movimiento }) {
    const recibido = Boolean(movimiento.fecha_recepcion);

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
                            Ticket <span className="font-bold text-gray-700">TK-{movimiento.id}</span>
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('patrimonio.dashboard')}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors"
                        >
                            Volver al Dashboard
                        </Link>
                        <button className="px-4 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors flex items-center">
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
                                    <p className="text-xs text-gray-500">Código</p>
                                    <p className="text-sm font-semibold text-gray-900">{movimiento.bien.codigo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Nombre</p>
                                    <p className="text-sm font-semibold text-gray-900">{movimiento.bien.nombre}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Condición al salir</p>
                                    <p className="text-sm text-gray-900">{movimiento.condicion_al_salir || 'No informada'}</p>
                                </div>
                                {recibido && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">Condición al recibir</p>
                                        <p className="text-sm text-gray-900">{movimiento.condicion_al_recibir || 'No informada'}</p>
                                    </div>
                                )}
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
                                    <p className="text-sm font-semibold text-gray-900">{movimiento.area_origen.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Área Destino</p>
                                    <p className="text-sm font-semibold text-gray-900">{movimiento.area_destino.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tipo de movimiento</p>
                                    <p className="text-sm text-gray-900">{movimiento.tipo_movimiento.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Motivo del traslado</p>
                                    <p className="text-sm text-gray-900">{movimiento.motivo.nombre}</p>
                                </div>
                                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Observaciones del emisor</p>
                                    <p className="text-sm text-gray-700 italic">
                                        {movimiento.observaciones_salida ? `"${movimiento.observaciones_salida}"` : 'Sin observaciones.'}
                                    </p>
                                </div>
                                {recibido && (
                                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Observaciones de recepción</p>
                                        <p className="text-sm text-gray-700 italic">
                                            {movimiento.observaciones_recepcion ? `"${movimiento.observaciones_recepcion}"` : 'Sin observaciones.'}
                                        </p>
                                    </div>
                                )}
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
                                <p className="text-xs text-gray-500">{formatFecha(movimiento.fecha_movimiento)}</p>
                                <p className="text-sm font-bold text-gray-900">Ticket Creado</p>
                                <p className="text-xs text-gray-600 mt-1">Generado por: {movimiento.creado_por.nombre}</p>
                            </div>

                            {/* Paso 2: Recepción */}
                            <div className="relative pl-6">
                                <div
                                    className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-white shadow-sm ${
                                        recibido ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                ></div>
                                <p className={`text-xs ${recibido ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {recibido ? formatFecha(movimiento.fecha_recepcion) : 'Pendiente'}
                                </p>
                                <p className={`text-sm font-bold ${recibido ? 'text-gray-900' : 'text-gray-400'}`}>
                                    Recepción en Destino
                                </p>
                                <p className={`text-xs mt-1 ${recibido ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {recibido
                                        ? `Recibido por: ${movimiento.recibido_por?.nombre ?? '—'}`
                                        : `A la espera de: ${movimiento.area_destino.nombre}`}
                                </p>
                            </div>

                        </div>

                        {/* Etiqueta de Estado General */}
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2 text-center">Estado actual del ticket</p>
                            <div
                                className={`w-full text-center py-2 font-bold text-sm border rounded-lg ${
                                    ESTADO_BANNER[movimiento.estado_movimiento.nombre] || 'bg-gray-50 text-gray-700 border-gray-200'
                                }`}
                            >
                                {movimiento.estado_movimiento.nombre.toUpperCase()}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}
