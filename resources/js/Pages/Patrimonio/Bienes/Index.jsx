import { useState } from 'react';
import { Boton, Buscador, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, Paginador, renglonTabla, Tarjeta } from 'hu-kit/componentes';
import FormularioBien from '@/Components/Patrimonio/FormularioBien';
import AppLayout from '@/Components/UI/AppLayout';
import { useBusquedaEnServidor } from '@/utils/busqueda';
import { tonoEstadoBien } from '@/utils/estados';

const ATENUADO = 'text-xs italic text-brandText-muted dark:text-brandText-mutedDark';

export default function Index({ bienes, busqueda: busquedaDelServidor = '', areas = [], estados = [], responsables = [] }) {
    const [editando, setEditando] = useState(null); // null | 'nuevo' | id
    const [busqueda, setBusqueda] = useBusquedaEnServidor('patrimonio.bienes.index', busquedaDelServidor);

    return (
        <AppLayout titulo="Directorio de bienes" subtitulo="Consulta y carga del inventario general.">
            <Tarjeta
                titulo="Bienes"
                icono="inventory_2"
                contador={bienes.total}
                acciones={editando === null && (
                    <Boton icono="add" forma="grupo" tipo="button" onClick={() => setEditando('nuevo')}>
                        Nuevo bien
                    </Boton>
                )}
            >
                <div className="mb-4">
                    <Buscador
                        nombre="busqueda"
                        etiqueta="Buscar bien"
                        valor={busqueda}
                        onChange={setBusqueda}
                        placeholder="Inventario, Diaguita, descripción o detalle"
                    />
                </div>

                {editando !== null && (
                    <FormularioBien
                        key={editando}
                        bien={editando === 'nuevo' ? null : bienes.data.find((b) => b.id === editando)}
                        areas={areas}
                        estados={estados}
                        responsables={responsables}
                        onCerrar={() => setEditando(null)}
                    />
                )}

                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[56rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">N° Inventario</th>
                                <th className="px-3 pb-2 font-semibold">N° Diaguita</th>
                                <th className="px-3 pb-2 font-semibold">Descripción</th>
                                <th className="px-3 pb-2 font-semibold">Área</th>
                                <th className="px-3 pb-2 font-semibold">Ubicación</th>
                                <th className="px-3 pb-2 font-semibold">Responsable</th>
                                <th className="px-3 pb-2 font-semibold">Estado</th>
                                <th className="w-px px-5 pb-2 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={cuerpoTabla}>
                            {bienes.data.length > 0 ? (
                                bienes.data.map((bien) => (
                                    <tr key={bien.id} className={renglonTabla}>
                                        <td className="px-5 py-3 font-semibold text-primary dark:text-gray-100">{bien.codigo}</td>
                                        <td className="px-3 py-3">{bien.numero_diaguita || <span className={ATENUADO}>sin cargar</span>}</td>
                                        <td className="px-3 py-3 font-semibold">{bien.nombre}</td>
                                        <td className="px-3 py-3">{bien.area?.nombre || '—'}</td>
                                        <td className="px-3 py-3">{bien.ubicacion_actual?.nombre || '—'}</td>
                                        <td className="px-3 py-3">{bien.responsable?.nombre || <span className={ATENUADO}>sin asignar</span>}</td>
                                        <td className="px-3 py-3">
                                            <Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Boton tipo="button" variante="fantasma" forma="grupo" icono="edit" onClick={() => setEditando(bien.id)}>
                                                    Editar
                                                </Boton>
                                                <Boton variante="fantasma" forma="grupo" icono="history" href={route('patrimonio.bienes.show', { bien: bien.id })}>
                                                    Ver historial
                                                </Boton>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8}>
                                        <EstadoVacio enTarjeta icono={busquedaDelServidor ? 'search_off' : 'inventory_2'}>
                                            {busquedaDelServidor ? `No se encontraron bienes para «${busquedaDelServidor}».` : 'No hay bienes para mostrar.'}
                                        </EstadoVacio>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 empty:hidden">
                    <Paginador paginador={bienes} />
                </div>
            </Tarjeta>
        </AppLayout>
    );
}
