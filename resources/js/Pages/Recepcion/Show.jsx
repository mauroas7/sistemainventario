import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { formatFecha } from '@/utils/format';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

export default function Show({ movimiento, responsables = [] }) {
    const m = movimiento || {};
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const esAdmin = user.rol === 'admin';
    const sinResponsable = !m.responsable_nuevo;
    const [nuevoResponsable, setNuevoResponsable] = useState('');
    const [asignando, setAsignando] = useState(false);

    // Estas acciones van por axios y no por fetch(): axios manda el token CSRF leyéndolo
    // de la cookie XSRF-TOKEN, que el servidor mantiene al día. El <meta name="csrf-token">
    // se renderiza una sola vez y queda viejo apenas el login rota la sesión, así que un
    // fetch() que lo leyera terminaba siempre en 419.
    function asignarResponsable(e) {
        e.preventDefault();
        if (!nuevoResponsable) return;

        setAsignando(true);

        axios.patch(route('patrimonio.movimientos.responsable', { movimiento: m.id }), {
            responsable_nuevo_id: nuevoResponsable,
        })
            .then(() => window.location.reload())
            .catch((error) => {
                alert(error.response?.data?.message || 'No se pudo asignar el responsable');
                setAsignando(false);
            });
    }

    const estaInformado = m.estado_movimiento?.nombre === 'Informado';
    // El acuse lo da quien quedo a cargo (o su area); anular, solo quien informo o Patrimonio.
    const puedeAcusar = m.estado_movimiento?.nombre !== 'Anulado' && !m.recibido_por
        && (user.rol === 'admin'
            || String(m.responsable_nuevo?.id) === String(user.id)
            || String(m.area_destino?.id) === String(user.area_id));
    const puedeAnular = estaInformado && (user.rol === 'admin' || String(m.creado_por?.id) === String(user.id));
    const puedeActuar = puedeAcusar || puedeAnular;

    // Recibe una URL absoluta armada con route(): así se evita el baseURL '/api' que
    // axios tiene configurado por defecto para los endpoints de la API.
    function postAction(url) {
        axios.post(url)
            .then(() => window.location.reload())
            .catch((error) => alert(error.response?.data?.message || 'No se pudo completar la acción'));
    }

    return (
        <SidebarLayout>
            <Head title={`Ticket TK-${m.id}`} />

            <div className="max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">Detalle del ticket</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            TK-{m.id || '—'} · {m.bien?.codigo || '—'} · Diaguita {m.bien?.numero_diaguita || 'sin cargar'} · {m.bien?.nombre || '—'}
                        </p>
                    </div>
                    <Link
                        href={route('recepcion.bandeja')}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Volver
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Estado del movimiento</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Estado</p>
                                <p className="font-medium">{m.estado_movimiento?.nombre || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Relación</p>
                                <p className="font-medium">
                                    {user.rol === 'admin'
                                        ? 'Admin'
                                        : String(m.area_origen?.id) === String(user.area_id)
                                            ? 'Enviado'
                                            : String(m.area_destino?.id) === String(user.area_id)
                                                ? 'A recibir'
                                                : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Origen</p>
                                <p className="font-medium">{m.area_origen?.nombre || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Destino</p>
                                <p className="font-medium">{m.area_destino?.nombre || '—'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Datos del ticket</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Informado por:</span> <span className="font-medium">{m.creado_por?.nombre || '—'}</span></div>
                            <div><span className="text-gray-500">Acuse de recibo:</span> <span className="font-medium">{m.recibido_por?.nombre || 'Sin acusar'}</span></div>
                            <div><span className="text-gray-500">Responsable anterior:</span> <span className="font-medium">{m.responsable_anterior?.nombre || 'Sin asignar'}</span></div>
                            <div>
                                <span className="text-gray-500">Quedó a cargo:</span>{' '}
                                {m.responsable_nuevo
                                    ? <span className="font-medium">{m.responsable_nuevo.nombre}</span>
                                    : <span className="font-medium text-amber-700">A definir por Gestión de Bienes</span>}
                            </div>
                            <div><span className="text-gray-500">Tipo:</span> <span className="font-medium">{m.tipo_movimiento?.nombre || '—'}</span></div>
                            <div><span className="text-gray-500">Motivo:</span> <span className="font-medium">{m.motivo?.nombre || '—'}</span></div>
                            <div><span className="text-gray-500">Fecha movimiento:</span> <span className="font-medium">{formatFecha(m.fecha_movimiento)}</span></div>
                            <div><span className="text-gray-500">Fecha recepción:</span> <span className="font-medium">{formatFecha(m.fecha_recepcion)}</span></div>
                            <div className="md:col-span-2">
                                <span className="text-gray-500">Observaciones salida:</span>
                                <p className="mt-1 font-medium">{m.observaciones_salida || '—'}</p>
                            </div>
                            {m.imagen_salida_url && (
                                <div className="md:col-span-2">
                                    <span className="text-gray-500">Imagen al salir:</span>
                                    <a href={m.imagen_salida_url} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
                                        <img
                                            src={m.imagen_salida_url}
                                            alt="Estado del bien al salir"
                                            className="h-48 w-auto rounded-lg border border-gray-200 object-cover shadow-sm transition-opacity hover:opacity-90"
                                        />
                                    </a>
                                </div>
                            )}
                        </div>

                        {sinResponsable && (
                            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-2">
                                    <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-700" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-amber-900">Este movimiento no tiene responsable definido</p>
                                        <p className="mt-1 text-xs text-amber-800">
                                            El bien figura en {m.area_destino?.nombre || 'el área destino'}, pero nadie quedó a cargo.
                                            {esAdmin
                                                ? ' Defina quién lo recibe para poder emitir la ficha de firmas.'
                                                : ' Gestión de Bienes va a definir el responsable.'}
                                        </p>

                                        {esAdmin && (responsables.length > 0 ? (
                                            <form onSubmit={asignarResponsable} className="mt-3 flex flex-wrap items-center gap-2">
                                                <select
                                                    value={nuevoResponsable}
                                                    onChange={(e) => setNuevoResponsable(e.target.value)}
                                                    className="rounded-lg border-amber-300 text-sm text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario"
                                                >
                                                    <option value="">Seleccione el responsable</option>
                                                    {responsables.map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="submit"
                                                    disabled={!nuevoResponsable || asignando}
                                                    className="rounded-lg bg-institucional-primario px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {asignando ? 'Asignando...' : 'Asignar responsable'}
                                                </button>
                                            </form>
                                        ) : (
                                            <p className="mt-3 text-xs text-amber-800">
                                                {m.area_destino?.nombre} no tiene usuarios registrados. Cree la cuenta
                                                desde Configuración para poder asignarle el bien.
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 border-t border-gray-100 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Acciones disponibles</p>
                            {puedeActuar ? (
                                <div className="flex flex-wrap gap-3">
                                    {puedeAcusar && (
                                        <button
                                            type="button"
                                            onClick={() => postAction(route('recepcion.confirmar', { movimiento: m.id }))}
                                            className="rounded-lg bg-institucional-primario px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-900"
                                        >
                                            Acusar recibo
                                        </button>
                                    )}
                                    {puedeAnular && (
                                        <button
                                            type="button"
                                            onClick={() => postAction(route('recepcion.cancelar', { movimiento: m.id }))}
                                            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                                        >
                                            Anular movimiento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    {m.estado_movimiento?.nombre === 'Anulado'
                                        ? 'Este movimiento fue anulado.'
                                        : m.recibido_por
                                            ? 'El movimiento ya tiene acuse de recibo.'
                                            : 'Sin acciones disponibles para tu rol.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
