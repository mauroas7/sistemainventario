import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import Cargando from '@/Components/Cargando';
import { formatFecha, estadoMovimientoClase } from '@/utils/formato';
import {
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/20/solid';

const FILTROS_VACIOS = {
    area_id: '',
    estado_movimiento_id: '',
    motivo_id: '',
    desde: '',
    hasta: '',
    bien: '',
};

function soloConValor(filtros) {
    return Object.fromEntries(
        Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
    );
}

export default function Dashboard({
    movimientos = [],
    paginacion = { pagina: 1, ultima_pagina: 1, total: 0, desde: null, hasta: null },
    resumen = { total: 0, informados: 0, registrados: 0, cerrados: 0, anulados: 0 },
    filtros: filtrosDelServidor = {},
    estados = [],
    areas = [],
    motivos = [],
}) {
    const { auth, errors } = usePage().props;
    const aplicados = Object.fromEntries(
        Object.entries({ ...FILTROS_VACIOS, ...filtrosDelServidor }).map(([clave, valor]) => [clave, valor ?? ''])
    );
    // `filtros` es lo que el usuario está tipeando; `aplicados` es lo que ya se consultó.
    const [filtros, setFiltros] = useState(aplicados);
    const [drafts, setDrafts] = useState({});
    const [cargando, setCargando] = useState(false);
    const pagina = paginacion.pagina;
    const errorFiltros = Object.keys(FILTROS_VACIOS).map((clave) => errors?.[clave]).filter(Boolean).join(' ');

    // Filtros y página viajan en la URL: una vista filtrada se puede recargar o compartir.
    function visitar(params, paginaSolicitada) {
        const query = soloConValor(params);
        if (paginaSolicitada > 1) query.page = paginaSolicitada;

        router.get(route('patrimonio.dashboard'), query, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setCargando(true),
            onFinish: () => setCargando(false),
        });
    }

    const hayFiltrosActivos = Object.values(aplicados).some(v => v !== '');

    function handleFiltro(e) {
        const { name, value } = e.target;
        setFiltros(f => ({ ...f, [name]: value }));
    }

    function aplicarFiltros(e) {
        e.preventDefault();
        visitar(filtros, 1);
    }

    function limpiarFiltros() {
        setFiltros(FILTROS_VACIOS);
        visitar(FILTROS_VACIOS, 1);
    }

    function irAPagina(nueva) {
        if (nueva < 1 || nueva > paginacion.ultima_pagina || nueva === pagina || cargando) return;
        visitar(aplicados, nueva);
    }

    function exportarCsv() {
        window.location.href = route('patrimonio.dashboard.exportar', soloConValor(aplicados));
    }

    function estadoElegido(m) {
        return drafts[m.id] ?? m.estado_movimiento?.id ?? '';
    }

    function setEstadoDraft(id, value) {
        setDrafts(prev => ({ ...prev, [id]: value }));
    }

    // El cambio de estado puede mover los totales y la página del movimiento: vuelve
    // la vista entera en vez de parchear la fila.
    function guardarEstado(m) {
        router.patch(route('patrimonio.movimientos.estado', { movimiento: m.id }), {
            estado_movimiento_id: estadoElegido(m),
        }, {
            preserveScroll: true,
            onSuccess: () => setDrafts({}),
            onError: (errores) => alert(Object.values(errores)[0] || 'No se pudo actualizar el estado'),
        });
    }

    const claseCampo = 'w-full rounded-lg border-gray-300 text-sm text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario';

    return (
        <SidebarLayout>
            <Head title="Control Patrimonial" />

            <div className="max-w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-institucional-primario">Control patrimonial</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Usuario actual: {auth?.usuario?.nombre} ({auth?.usuario?.rol})
                    </p>
                </div>

                {/* Filtros */}
                <form onSubmit={aplicarFiltros} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FunnelIcon className="h-4 w-4 text-institucional-primario" />
                        <h3 className="text-sm font-bold text-institucional-primario">Filtros del dashboard</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label htmlFor="f-area" className="mb-1 block text-xs font-medium text-gray-600">Sector (origen o destino)</label>
                            <select id="f-area" name="area_id" value={filtros.area_id} onChange={handleFiltro} className={claseCampo}>
                                <option value="">Todos</option>
                                {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="f-estado" className="mb-1 block text-xs font-medium text-gray-600">Estado</label>
                            <select id="f-estado" name="estado_movimiento_id" value={filtros.estado_movimiento_id} onChange={handleFiltro} className={claseCampo}>
                                <option value="">Todos</option>
                                {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="f-motivo" className="mb-1 block text-xs font-medium text-gray-600">Motivo del traslado</label>
                            <select id="f-motivo" name="motivo_id" value={filtros.motivo_id} onChange={handleFiltro} className={claseCampo}>
                                <option value="">Todos</option>
                                {motivos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="f-desde" className="mb-1 block text-xs font-medium text-gray-600">Desde</label>
                            <input id="f-desde" type="date" name="desde" value={filtros.desde} onChange={handleFiltro} className={claseCampo} />
                        </div>

                        <div>
                            <label htmlFor="f-hasta" className="mb-1 block text-xs font-medium text-gray-600">Hasta</label>
                            <input id="f-hasta" type="date" name="hasta" value={filtros.hasta} onChange={handleFiltro} className={claseCampo} />
                        </div>

                        <div>
                            <label htmlFor="f-bien" className="mb-1 block text-xs font-medium text-gray-600">Bien (código o nombre)</label>
                            <input id="f-bien" type="text" name="bien" value={filtros.bien} onChange={handleFiltro} placeholder="Ej: MON001 o Monitor" className={claseCampo} />
                        </div>
                    </div>

                    {errorFiltros && (
                        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorFiltros}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            className="rounded-lg bg-institucional-primario px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
                        >
                            Aplicar filtros
                        </button>
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            Limpiar
                        </button>
                        <button
                            type="button"
                            onClick={exportarCsv}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-institucional-primario/30 bg-institucional-primario/5 px-5 py-2.5 text-sm font-medium text-institucional-primario shadow-sm transition-colors hover:bg-institucional-primario/10"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Exportar CSV
                        </button>
                        {hayFiltrosActivos && (
                            <span className="text-xs font-medium text-institucional-primario">
                                Vista filtrada · {resumen.total} movimiento{resumen.total === 1 ? '' : 's'}
                            </span>
                        )}
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                            <ClipboardDocumentListIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{resumen.total}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <ClockIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">A cargar en Diaguita</p>
                            <p className="mt-1 text-2xl font-bold text-amber-700">{resumen.informados}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <ClipboardDocumentListIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Registrados</p>
                            <p className="mt-1 text-2xl font-bold text-blue-700">{resumen.registrados}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                            <CheckCircleIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Cerrados</p>
                            <p className="mt-1 text-2xl font-bold text-green-700">{resumen.cerrados}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-600">
                            <XCircleIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Anulados</p>
                            <p className="mt-1 text-2xl font-bold text-gray-700">{resumen.anulados}</p>
                        </div>
                    </div>
                </div>

                {cargando ? <Cargando mensaje="Cargando movimientos..." /> : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-institucional-primario/5">
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">N° Inventario</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">N° Diaguita</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Fecha</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Ubicación actual</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Responsable actual</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Descripción del bien</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Detalle del bien</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Nueva ubicación</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Nuevo responsable</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Motivo del traslado</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Estado actual</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Nuevo estado</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-right whitespace-nowrap">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {movimientos.map((m) => (
                                    <tr key={m.id}>
                                        <td className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">{m.bien?.codigo || '—'}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {m.bien?.numero_diaguita
                                                ? <span className="text-gray-600">{m.bien.numero_diaguita}</span>
                                                : <span className="italic text-gray-400">sin cargar</span>}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatFecha(m.fecha_movimiento)}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{m.area_origen?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{m.responsable_anterior?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={m.bien?.descripcion || m.bien?.nombre || ''}>{m.bien?.descripcion || m.bien?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={m.bien?.descripcion || m.bien?.nombre || ''}>{m.bien?.descripcion || m.bien?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{m.area_destino?.nombre || '—'}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {m.responsable_nuevo?.nombre
                                                ? <span className="text-gray-600">{m.responsable_nuevo.nombre}</span>
                                                : <span className="font-medium text-amber-700">A definir</span>}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{m.motivo?.nombre || '—'}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${estadoMovimientoClase(m.estado_movimiento?.nombre)}`}>
                                                {m.estado_movimiento?.nombre || '—'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <select
                                                value={estadoElegido(m)}
                                                onChange={(e) => setEstadoDraft(m.id, e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm focus:border-institucional-primario focus:ring-institucional-primario"
                                            >
                                                <option value="">Seleccione</option>
                                                {estados.map((estado) => (
                                                    <option key={estado.id} value={estado.id}>
                                                        {estado.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => guardarEstado(m)}
                                                className="rounded-lg bg-institucional-primario px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-900"
                                            >
                                                Guardar
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {movimientos.length === 0 && (
                                    <tr>
                                        <td colSpan={13} className="py-8 text-center text-sm text-gray-500">
                                            {hayFiltrosActivos
                                                ? 'Ningún movimiento coincide con los filtros aplicados.'
                                                : 'No hay movimientos registrados.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paginacion.total > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                Mostrando {paginacion.desde}–{paginacion.hasta} de {paginacion.total}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => irAPagina(pagina - 1)}
                                    disabled={pagina <= 1}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                                    Anterior
                                </button>
                                <span className="text-xs font-medium text-gray-600">
                                    Página {paginacion.pagina} de {paginacion.ultima_pagina}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => irAPagina(pagina + 1)}
                                    disabled={pagina >= paginacion.ultima_pagina}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                    <ChevronRightIcon className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>
        </SidebarLayout>
    );
}
