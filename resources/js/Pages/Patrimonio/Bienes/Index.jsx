import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import LoadingState from '@/Components/LoadingState';
import { estadoBienClase } from '@/utils/format';
import axios from 'axios';

export default function Index() {
    const [bienes, setBienes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        axios.get('/bien')
            .then(r => setBienes(r.data.data || r.data || []))
            .finally(() => setCargando(false));
    }, []);

    return (
        <SidebarLayout>
            <Head title="Directorio de Bienes" />

            <div className="max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-institucional-primario">Directorio de Bienes</h2>
                        <p className="text-sm text-gray-500 mt-1">Consulta del inventario general.</p>
                    </div>
                </div>

                {cargando ? <LoadingState mensaje="Cargando bienes..." /> : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="py-3 px-4">N° Inventario</th>
                                    <th className="py-3 px-4">N° Diaguita</th>
                                    <th className="py-3 px-4">Descripción</th>
                                    <th className="py-3 px-4">Área</th>
                                    <th className="py-3 px-4">Ubicación</th>
                                    <th className="py-3 px-4">Responsable</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {bienes.map((bien) => (
                                    <tr key={bien.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-institucional-primario">{bien.codigo}</td>
                                        <td className="py-3 px-4">
                                            {bien.numero_diaguita
                                                ? <span className="text-gray-600">{bien.numero_diaguita}</span>
                                                : <span className="italic text-gray-400 text-xs">sin cargar</span>}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 font-medium">{bien.nombre}</td>
                                        <td className="py-3 px-4 text-gray-500">{bien.area?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600">{bien.ubicacion_actual?.nombre || '—'}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {bien.responsable?.nombre || <span className="italic text-gray-400 text-xs">sin asignar</span>}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${estadoBienClase(bien.estado?.nombre)}`}>
                                                {bien.estado?.nombre || '—'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={`/patrimonio/bienes/show?bien=${bien.id}`}
                                                className="text-institucional-primario hover:text-blue-700 font-medium text-xs hover:underline"
                                            >
                                                Ver historial
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {bienes.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                                            No hay bienes para mostrar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}
            </div>
        </SidebarLayout>
    );
}
