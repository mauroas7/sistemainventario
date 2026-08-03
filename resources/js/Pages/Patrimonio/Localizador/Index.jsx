import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import LoadingState from '@/Components/LoadingState';
import { formatFecha, estadoBienClase } from '@/utils/format';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

function normalizar(texto) {
    return String(texto ?? '').toLowerCase();
}

export default function Index() {
    const [bienes, setBienes] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [query, setQuery] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get('/bien'),
            axios.get('/movimientos'),
        ]).then(([bienRes, movRes]) => {
            setBienes(bienRes.data.data || bienRes.data || []);
            setMovimientos(movRes.data.data || movRes.data || []);
        }).finally(() => setCargando(false));
    }, []);

    const ultimoMovimientoPorBien = useMemo(() => {
        const mapa = {};
        movimientos.forEach((m) => {
            const bienId = m.bien?.id;
            if (!bienId) return;
            const actual = mapa[bienId];
            if (!actual || new Date(m.fecha_movimiento) > new Date(actual.fecha_movimiento)) {
                mapa[bienId] = m;
            }
        });
        return mapa;
    }, [movimientos]);

    const resultados = useMemo(() => {
        const q = normalizar(query.trim());

        return bienes
            .filter((bien) => {
                if (!q) return true;
                return normalizar(bien.codigo).includes(q)
                    || normalizar(bien.numero_diaguita).includes(q)
                    || normalizar(bien.nombre).includes(q)
                    || normalizar(bien.descripcion).includes(q);
            })
            .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
    }, [bienes, query]);

    return (
        <SidebarLayout>
            <Head title="Localizador de Bienes" />

            <div className="max-w-5xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-institucional-primario">Localizador de bienes</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Buscá por número de inventario interno, número de Diaguita, nombre o descripción.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <label htmlFor="localizador-query" className="mb-1 block text-sm font-medium text-blue-900/70">
                        Buscar bien
                    </label>
                    <div className="relative">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            id="localizador-query"
                            type="text"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ej: MON001, 950003, notebook, impresora..."
                            className="w-full rounded-lg border-gray-300 pl-9 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {cargando && <LoadingState mensaje="Cargando bienes..." />}

                    {!cargando && resultados.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center text-sm text-gray-500">
                            No se encontraron bienes para "{query}".
                        </div>
                    )}

                    {!cargando && resultados.map((bien) => {
                        const ultimo = ultimoMovimientoPorBien[bien.id];

                        return (
                            <div key={bien.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-institucional-primario">
                                            {bien.codigo}
                                            <span className="ml-2 font-normal normal-case tracking-normal text-gray-400">
                                                Diaguita: {bien.numero_diaguita || 'sin cargar'}
                                            </span>
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">{bien.nombre}</p>
                                        {bien.descripcion && (
                                            <p className="text-sm text-gray-500 mt-1">{bien.descripcion}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/patrimonio/bienes/show?bien=${bien.id}`}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 whitespace-nowrap"
                                    >
                                        Ver historial completo
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500">Ubicación actual</p>
                                        <p className="text-sm font-semibold text-gray-900">{bien.ubicacion_actual?.nombre || bien.area?.nombre || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Responsable actual</p>
                                        <p className="text-sm font-semibold text-gray-900">{bien.responsable?.nombre || 'Sin asignar'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Estado del bien</p>
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estadoBienClase(bien.estado?.nombre)}`}>
                                            {bien.estado?.nombre || '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Último movimiento</p>

                                    {!ultimo ? (
                                        <p className="text-sm text-gray-500">Este bien no tiene movimientos registrados todavía.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Ticket</p>
                                                <p className="font-medium text-gray-900">TK-{ultimo.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Estado</p>
                                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                    {ultimo.estado_movimiento?.nombre || '—'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Traslado</p>
                                                <p className="font-medium text-gray-900">{ultimo.area_origen?.nombre || '—'} → {ultimo.area_destino?.nombre || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Fecha</p>
                                                <p className="font-medium text-gray-900">{formatFecha(ultimo.fecha_movimiento)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Responsable anterior</p>
                                                <p className="font-medium text-gray-900">{ultimo.responsable_anterior?.nombre || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Quedó a cargo</p>
                                                <p className="font-medium text-gray-900">{ultimo.responsable_nuevo?.nombre || '—'}</p>
                                            </div>
                                            <div className="sm:col-span-2 lg:col-span-2">
                                                <p className="text-xs text-gray-500">Motivo</p>
                                                <p className="font-medium text-gray-900">{ultimo.motivo?.nombre || '—'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </SidebarLayout>
    );
}
