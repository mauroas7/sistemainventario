import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Create({ bienes = [] }) {
    return (
        <SidebarLayout>
            <Head title="Crear Ticket de Envío" />

            <div className="max-w-5xl">
                {/* Título de la vista */}
                <h2 className="mb-6 text-2xl font-bold text-institucional-primario">
                    Nuevo movimiento de bien
                </h2>

                {/* Contenedor del formulario */}
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form className="space-y-6">

                        {/* Fila 1: Solicitantes */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-blue-900/70">
                                    Área solicitante
                                </label>

                                <input
                                    type="text"
                                    readOnly
                                    defaultValue="Área Académica"
                                    className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-blue-900/70">
                                    Responsable solicitante
                                </label>

                                <input
                                    type="text"
                                    readOnly
                                    defaultValue="Coordinador Académico"
                                    className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Fila 2: Bien y tipo de movimiento */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="bien_id"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Bien (código + nombre) *
                                </label>

                                <select
                                    id="bien_id"
                                    name="bien_id"
                                    defaultValue=""
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Seleccione un bien
                                    </option>

                                    {bienes.map((bien) => (
                                        <option key={bien.id} value={bien.id}>
                                            {bien.codigo_patrimonial} - {bien.nombre}
                                            {bien.marca ? ` - ${bien.marca}` : ''}
                                            {bien.modelo ? ` ${bien.modelo}` : ''}
                                        </option>
                                    ))}
                                </select>

                                {bienes.length === 0 && (
                                    <p className="mt-2 text-sm text-red-600">
                                        No hay bienes disponibles registrados.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="tipo_movimiento"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Tipo de movimiento *
                                </label>

                                <select
                                    id="tipo_movimiento"
                                    name="tipo_movimiento"
                                    defaultValue="Reparación"
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="Reparación">Reparación</option>
                                    <option value="Traslado">Traslado</option>
                                    <option value="Préstamo">Préstamo</option>
                                    <option value="Devolución">Devolución</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 3: Origen y destino */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="origen"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Origen *
                                </label>

                                <select
                                    id="origen"
                                    name="origen"
                                    defaultValue="Área Académica"
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="Área Académica">
                                        Área Académica
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="destino"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Destino *
                                </label>

                                <select
                                    id="destino"
                                    name="destino"
                                    defaultValue="TICs"
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="TICs">TICs</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 4: Motivo */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="motivo"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Motivo *
                                </label>

                                <select
                                    id="motivo"
                                    name="motivo"
                                    defaultValue="Rotura"
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="Rotura">Rotura</option>
                                    <option value="Mantenimiento">
                                        Mantenimiento
                                    </option>
                                    <option value="Cambio de ubicación">
                                        Cambio de ubicación
                                    </option>
                                    <option value="Uso temporal">
                                        Uso temporal
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 5: Observaciones */}
                        <div>
                            <label
                                htmlFor="observaciones"
                                className="mb-1 block text-sm font-medium text-blue-900/70"
                            >
                                Observaciones
                            </label>

                            <textarea
                                id="observaciones"
                                name="observaciones"
                                rows={3}
                                defaultValue="No enciende. Se entrega con cargador."
                                className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                            />
                        </div>

                        {/* Fila 6: Adjuntar foto */}
                        <div>
                            <label
                                htmlFor="foto"
                                className="mb-1 block text-sm font-medium text-blue-900/70"
                            >
                                Adjuntar foto (opcional)
                            </label>

                            <input
                                id="foto"
                                name="foto"
                                type="file"
                                accept="image/*"
                                className="w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-500 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                            />
                        </div>

                        {/* Fila 7: Botones */}
                        <div className="flex items-center space-x-4 pt-4">
                            <Link
                                href="/inicio"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="button"
                                disabled={bienes.length === 0}
                                className="rounded-lg bg-institucional-primario px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Crear ticket
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
