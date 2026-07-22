import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function CrearTicket() {
    return (
        <SidebarLayout>
            <Head title="Crear Ticket de Envío" />

            <div className="max-w-5xl">
                {/* Título de la vista */}
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">
                    Nuevo movimiento de bien
                </h2>
                
                {/* Contenedor del Formulario */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <form className="space-y-6">
                        
                        {/* Fila 1: Solicitantes (Campos de solo lectura) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Area solicitante
                                </label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    defaultValue="Area Academica" 
                                    className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-700 sm:text-sm focus:ring-0" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Responsable solicitante
                                </label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    defaultValue="Coordinador Academico" 
                                    className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-700 sm:text-sm focus:ring-0" 
                                />
                            </div>
                        </div>

                        {/* Fila 2: Bien y Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Bien (ID + nombre) *
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>3242 - Notebook Dell Latitude</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Tipo de movimiento *
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>Reparacion</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 3: Origen y Destino */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Origen *
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>Area Academica</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Destino *
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>TICs</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 4: Motivo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                    Motivo *
                                </label>
                                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700">
                                    <option>Rotura</option>
                                </select>
                            </div>
                        </div>

                        {/* Fila 5: Observaciones (Ocupa todo el ancho) */}
                        <div>
                            <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                Observaciones
                            </label>
                            <textarea 
                                rows="3" 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm text-gray-700"
                                defaultValue="No enciende. Se entrega con cargador."
                            ></textarea>
                        </div>

                        {/* Fila 6: Adjuntar foto */}
                        <div>
                            <label className="block text-sm font-medium text-blue-900/70 mb-1">
                                Adjuntar foto (opcional)
                            </label>
                            <input 
                                type="file" 
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded-lg shadow-sm bg-white" 
                            />
                        </div>

                        {/* Fila 7: Botones de Acción */}
                        <div className="flex items-center space-x-4 pt-4">
                            <Link 
                                href="/inicio"
                                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button 
                                type="button" 
                                className="px-6 py-2.5 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 shadow-sm transition-colors"
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