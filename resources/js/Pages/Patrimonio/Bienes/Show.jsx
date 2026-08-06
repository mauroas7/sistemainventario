import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import LoadingState from '@/Components/LoadingState';
import { formatFecha } from '@/utils/format';
import axios from 'axios';

export default function Show() {
    const bienId = useMemo(() => new URLSearchParams(window.location.search).get('bien'), []);
    const [bien, setBien] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Sin bien en la URL no hay ficha que mostrar. Antes se caía al primero de la
        // lista y se mostraba con su código real, como si fuera el que se pidió.
        if (!bienId) {
            setCargando(false);
            return;
        }

        setCargando(true);

        axios.get('/bien')
            .then((r) => {
                const lista = r.data.data || r.data || [];
                const elegido = lista.find(item => String(item.id) === String(bienId)) || null;
                setBien(elegido);

                if (!elegido) {
                    setMovimientos([]);
                    return null;
                }

                // El historial se filtra por código en el servidor en vez de traer la
                // lista completa y buscar en el cliente: la API pagina de a 20 y el
                // registro del bien quedaba recortado. El filtro del backend es un LIKE,
                // así que después se afina por id exacto.
                return axios.get('/movimientos', { params: { bien: elegido.codigo, per_page: 100 } })
                    .then((mr) => {
                        const movs = mr.data.data || mr.data || [];
                        setMovimientos(movs.filter(m => String(m.bien?.id) === String(bienId)));
                    });
            })
            .catch(() => {
                setBien(null);
                setMovimientos([]);
            })
            .finally(() => setCargando(false));
    }, [bienId]);

    return (
        <SidebarLayout>
            <Head title="Historial del Bien" />

            <div className="max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">Ficha y Registro Histórico</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Bien <span className="font-bold text-gray-700">{bien ? `#${bien.codigo} - ${bien.nombre}` : 'sin seleccionar'}</span>
                        </p>
                    </div>
                    <Link href="/patrimonio/bienes" className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors">
                        Volver al Directorio
                    </Link>
                </div>

                {cargando ? (
                    <LoadingState mensaje="Cargando ficha del bien..." />
                ) : !bien ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-sm text-gray-500">
                        No hay un bien seleccionado.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Datos del Activo</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Código</p>
                                        <p className="text-sm font-bold text-gray-900">{bien.codigo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Descripción</p>
                                        <p className="text-sm text-gray-900">{bien.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Detalle</p>
                                        <p className="text-sm text-gray-700">{bien.descripcion || '—'}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Ubicación Actual</p>
                                    <p className="text-sm font-bold text-gray-900">{bien.ubicacion_actual?.nombre || '—'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-6 border-b pb-2">Registro de Movimientos</h3>

                            <div className="space-y-4">
                                {movimientos.map((m) => (
                                    <div key={m.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-bold text-gray-900">TK-{m.id}</p>
                                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 whitespace-nowrap">
                                                {m.estado_movimiento?.nombre || (m.recibido_por ? 'Recibido' : 'Pendiente')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {m.area_origen?.nombre} → {m.area_destino?.nombre}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatFecha(m.fecha_movimiento)}
                                        </p>
                                    </div>
                                ))}

                                {movimientos.length === 0 && (
                                    <div className="text-sm text-gray-500">
                                        No hay movimientos asociados a este bien.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
