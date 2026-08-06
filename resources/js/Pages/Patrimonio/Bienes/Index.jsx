import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

const ESTADO_CLASES = {
    Disponible: 'bg-green-100 text-green-800 border-green-200',
    'En uso': 'bg-green-100 text-green-800 border-green-200',
    Prestado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'En mantenimiento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Dañado: 'bg-red-100 text-red-800 border-red-200',
    Baja: 'bg-red-100 text-red-800 border-red-200',
};

export default function Index({ bienes = [] }) {
    return (
        <SidebarLayout>
            <Head title="Directorio de Bienes" />

            <div className="max-w-7xl">
                {/* Cabecera */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-institucional-primario">
                        Directorio de Bienes
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestión y consulta del inventario general del hospital.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Tabla de Directorio */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="py-3 px-4">Código</th>
                                    <th className="py-3 px-4">Descripción del Bien</th>
                                    <th className="py-3 px-4">Ubicación Actual</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {bienes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                                            No hay bienes registrados.
                                        </td>
                                    </tr>
                                )}

                                {bienes.map((bien) => (
                                    <tr key={bien.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-institucional-primario">{bien.codigo}</td>
                                        <td className="py-3 px-4 text-gray-800 font-medium">{bien.nombre}</td>
                                        <td className="py-3 px-4 text-gray-600">{bien.ubicacion_actual.nombre}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                    ESTADO_CLASES[bien.estado.nombre] || 'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}
                                            >
                                                {bien.estado.nombre}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={route('patrimonio.bienes.show', bien.id)}
                                                className="text-institucional-primario hover:text-blue-700 font-medium text-xs hover:underline"
                                            >
                                                Ver historial
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <span className="text-sm text-gray-500">
                            Mostrando <span className="font-medium text-gray-900">{bienes.length}</span> bienes
                        </span>
                    </div>

                </div>
            </div>
        </SidebarLayout>
    );
}
