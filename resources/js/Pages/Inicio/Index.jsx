import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Index() {
    return (
        <SidebarLayout>
            <Head title="Inicio" />

            <div className="max-w-4xl">
                {/* Título de la vista */}
                <h2 className="text-2xl font-bold text-institucional-primario mb-6">
                    Inicio
                </h2>

                {/* Tarjeta 1: Accesos rápidos */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <p className="text-sm text-gray-500 mb-5">
                        Accesos rapidos para operar movimientos de bienes.
                    </p>
                    
                    <div className="flex space-x-4">
                        {/* Botón Envío (Primario) */}
                        <Link
                            href="/envio/crear-ticket"
                            className="px-8 py-2 bg-institucional-primario text-white rounded-lg font-medium text-sm hover:bg-blue-900 transition-colors shadow-sm"
                        >
                            Envio
                        </Link>
                        
                        {/* Botón Recepción (Secundario) */}
                        <Link
                            href="/recepcion/bandeja"
                            className="px-8 py-2 bg-white text-institucional-primario border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Recepcion
                        </Link>
                    </div>
                </div>

                {/* Tarjeta 2: Flujo de envío */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-institucional-primario mb-5">
                        Flujo de envio
                    </h3>
                    
                    <div className="space-y-4 text-sm text-gray-700">
                        <p>
                            <strong className="text-gray-900">1.</strong> El coordinador selecciona el bien y completa el traslado.
                        </p>
                        <p>
                            <strong className="text-gray-900">2.</strong> Se crea ticket y queda pendiente de recepcion.
                        </p>
                        <p>
                            <strong className="text-gray-900">3.</strong> El area destino confirma recepcion.
                        </p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}