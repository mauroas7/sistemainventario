import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import LoadingState from '@/Components/LoadingState';
import { formatFecha } from '@/utils/format';
import axios from 'axios';

export default function Show() {
    const movimientoId = useMemo(() => new URLSearchParams(window.location.search).get('movimiento'), []);
    const [movimiento, setMovimiento] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Sin ticket en la URL no hay nada que auditar. Antes se caía al primero de la
        // lista y se mostraba con su número real, como si fuera el que se pidió.
        if (!movimientoId) {
            setCargando(false);
            return;
        }

        // Se pide el movimiento puntual: traer la lista y buscarlo en el cliente fallaba
        // apenas el ticket quedaba fuera de la primera página (la API pagina de a 20).
        setCargando(true);

        axios.get(`/movimientos/${movimientoId}`)
            .then(r => setMovimiento(r.data.data || r.data || null))
            .catch(() => setMovimiento(null))
            .finally(() => setCargando(false));
    }, [movimientoId]);

    return (
        <SidebarLayout>
            <Head title="Auditoría de Ticket" />

            <div className="max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">Auditoría de Movimiento</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Ticket <span className="font-bold text-gray-700">{movimiento ? `#TK-${movimiento.id}` : 'sin seleccionar'}</span>
                        </p>
                    </div>
                    <Link href="/patrimonio/dashboard" className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors">
                        Volver al Dashboard
                    </Link>
                </div>

                {cargando ? (
                    <LoadingState mensaje="Cargando ticket..." />
                ) : !movimiento ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-sm text-gray-500">
                        No hay un ticket seleccionado.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Identificación del Bien</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Bien</p>
                                        <p className="text-sm font-semibold text-gray-900">{movimiento.bien?.codigo} - {movimiento.bien?.nombre}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Diaguita: {movimiento.bien?.numero_diaguita || 'sin cargar'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Estado</p>
                                        <p className="text-sm font-semibold text-gray-900">{movimiento.estado_movimiento?.nombre || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Detalles del Movimiento</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Área Origen</p>
                                        <p className="text-sm font-semibold text-gray-900">{movimiento.area_origen?.nombre || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Área Destino</p>
                                        <p className="text-sm font-semibold text-gray-900">{movimiento.area_destino?.nombre || '—'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Motivo</p>
                                        <p className="text-sm text-gray-900">{movimiento.motivo?.nombre || '—'}</p>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                                        <p className="text-sm text-gray-700 italic">{movimiento.observaciones_salida || '—'}</p>
                                    </div>
                                    {movimiento.imagen_salida_url && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 mb-2">Imagen al salir</p>
                                            <a href={movimiento.imagen_salida_url} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                                <img
                                                    src={movimiento.imagen_salida_url}
                                                    alt="Estado del bien al salir"
                                                    className="h-48 w-auto rounded-lg border border-gray-200 object-cover shadow-sm transition-opacity hover:opacity-90"
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
                            <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-6 border-b pb-2">Cadena de Custodia</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Informado por</p>
                                    <p className="font-medium text-gray-900">{movimiento.creado_por?.nombre || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Responsable anterior</p>
                                    <p className="font-medium text-gray-900">{movimiento.responsable_anterior?.nombre || 'Sin asignar'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Quedó a cargo</p>
                                    <p className="font-medium text-gray-900">{movimiento.responsable_nuevo?.nombre || 'Sin asignar'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Registrado en Diaguita</p>
                                    <p className="font-medium text-gray-900">{movimiento.fecha_registro_diaguita ? formatFecha(movimiento.fecha_registro_diaguita) : 'Pendiente'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fecha movimiento</p>
                                    <p className="font-medium text-gray-900">{formatFecha(movimiento.fecha_movimiento)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Acuse de recibo</p>
                                    <p className="font-medium text-gray-900">{movimiento.fecha_recepcion ? formatFecha(movimiento.fecha_recepcion) : 'Sin acusar'}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                                    Historial de estados
                                </p>

                                {!movimiento.historial_estados?.length ? (
                                    <p className="text-sm text-gray-500">Sin cambios de estado registrados.</p>
                                ) : (
                                    <ol className="space-y-3">
                                        {movimiento.historial_estados.map((cambio) => (
                                            <li key={cambio.id} className="border-l-2 border-gray-200 pl-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {cambio.estado_anterior
                                                        ? `${cambio.estado_anterior} → ${cambio.estado_nuevo}`
                                                        : `Alta como "${cambio.estado_nuevo}"`}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFecha(cambio.fecha)} · {cambio.usuario || 'sin usuario registrado'}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
