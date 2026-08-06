import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

const initialForm = {
    bien_id: '',
    tipo_movimiento_id: '',
    area_destino_id: '',
    motivo_id: '',
    condicion_al_salir: '',
    observaciones_salida: '',
};

export default function Create({ bienes = [], areas = [], tiposMovimiento = [], motivos = [] }) {
    const { auth } = usePage().props;
    const usuario = auth?.user;
    const areaOrigen = usuario?.area;
    const destinos = areas.filter((area) => area.id !== areaOrigen?.id);

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccess(false);

        window.axios
            .post(route('movimientos.store'), form)
            .then(() => {
                setSuccess(true);
                setForm(initialForm);
                router.reload({ only: ['bienes'] });
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors || {});
                } else {
                    setErrors({
                        general: [error.response?.data?.message || 'No se pudo registrar el movimiento.'],
                    });
                }
            })
            .finally(() => setProcessing(false));
    };

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
                    {success && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            Ticket creado correctamente.
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <ul className="list-disc pl-5">
                                {Object.values(errors).flat().map((msg, i) => (
                                    <li key={i}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Fila 1: Solicitantes */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-blue-900/70">
                                    Área solicitante
                                </label>

                                <input
                                    type="text"
                                    readOnly
                                    value={areaOrigen?.nombre || 'Sin área asignada'}
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
                                    value={usuario?.name || ''}
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
                                    value={form.bien_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Seleccione un bien
                                    </option>

                                    {bienes.map((bien) => (
                                        <option key={bien.id} value={bien.id}>
                                            {bien.codigo} - {bien.nombre}
                                        </option>
                                    ))}
                                </select>

                                {bienes.length === 0 && (
                                    <p className="mt-2 text-sm text-red-600">
                                        No hay bienes disponibles registrados en su área.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="tipo_movimiento_id"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Tipo de movimiento *
                                </label>

                                <select
                                    id="tipo_movimiento_id"
                                    name="tipo_movimiento_id"
                                    value={form.tipo_movimiento_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Seleccione un tipo
                                    </option>

                                    {tiposMovimiento.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
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

                                <input
                                    id="origen"
                                    type="text"
                                    readOnly
                                    value={areaOrigen?.nombre || 'Sin área asignada'}
                                    className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="area_destino_id"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Destino *
                                </label>

                                <select
                                    id="area_destino_id"
                                    name="area_destino_id"
                                    value={form.area_destino_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Seleccione un destino
                                    </option>

                                    {destinos.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila 4: Motivo */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="motivo_id"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Motivo *
                                </label>

                                <select
                                    id="motivo_id"
                                    name="motivo_id"
                                    value={form.motivo_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Seleccione un motivo
                                    </option>

                                    {motivos.map((motivo) => (
                                        <option key={motivo.id} value={motivo.id}>
                                            {motivo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="condicion_al_salir"
                                    className="mb-1 block text-sm font-medium text-blue-900/70"
                                >
                                    Condición al salir
                                </label>

                                <input
                                    id="condicion_al_salir"
                                    name="condicion_al_salir"
                                    type="text"
                                    value={form.condicion_al_salir}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Fila 5: Observaciones */}
                        <div>
                            <label
                                htmlFor="observaciones_salida"
                                className="mb-1 block text-sm font-medium text-blue-900/70"
                            >
                                Observaciones
                            </label>

                            <textarea
                                id="observaciones_salida"
                                name="observaciones_salida"
                                rows={3}
                                value={form.observaciones_salida}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm"
                            />
                        </div>

                        {/* Fila 6: Botones */}
                        <div className="flex items-center space-x-4 pt-4">
                            <Link
                                href="/inicio"
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={bienes.length === 0 || processing}
                                className="rounded-lg bg-institucional-primario px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Creando...' : 'Crear ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
