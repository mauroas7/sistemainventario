import { usePage } from '@inertiajs/react';
import { Buscador, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, Paginador, renglonTabla, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { useBusquedaEnServidor } from '@/utils/busqueda';
import { tonoEstadoBien } from '@/utils/estados';

const ATENUADO = 'text-xs italic text-brandText-muted dark:text-brandText-mutedDark';

export default function Index({ bienes, busqueda: busquedaDelServidor = '' }) {
    const area = usePage().props.auth.usuario.area;
    const [busqueda, setBusqueda] = useBusquedaEnServidor('mis-bienes', busquedaDelServidor);

    return (
        <AppLayout titulo="Mis bienes" subtitulo={`Los bienes de ${area?.nombre ?? 'tu área'}: qué son y quién los tiene a cargo.`}>
            <Tarjeta titulo="Bienes del área" icono="inventory_2" contador={bienes.total}>
                <div className="mb-4">
                    <Buscador
                        nombre="busqueda"
                        etiqueta="Buscar bien"
                        valor={busqueda}
                        onChange={setBusqueda}
                        placeholder="Inventario, Diaguita, descripción o detalle"
                    />
                </div>

                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full min-w-[44rem] text-sm">
                        <thead>
                            <tr className={encabezadoTabla}>
                                <th className="px-5 pb-2 font-semibold">N° Inventario</th>
                                <th className="px-3 pb-2 font-semibold">N° Diaguita</th>
                                <th className="px-3 pb-2 font-semibold">Descripción</th>
                                <th className="px-3 pb-2 font-semibold">Responsable</th>
                                <th className="px-5 pb-2 font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className={cuerpoTabla}>
                            {bienes.data.length > 0 ? (
                                bienes.data.map((bien) => (
                                    <tr key={bien.id} className={renglonTabla}>
                                        <td className="px-5 py-3 font-semibold text-primary dark:text-gray-100">{bien.codigo}</td>
                                        <td className="px-3 py-3">{bien.numero_diaguita || <span className={ATENUADO}>sin cargar</span>}</td>
                                        <td className="px-3 py-3">
                                            <p className="font-semibold">{bien.nombre}</p>
                                            {bien.descripcion && (
                                                <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">{bien.descripcion}</p>
                                            )}
                                        </td>
                                        <td className="px-3 py-3">{bien.responsable?.nombre || <span className={ATENUADO}>sin asignar</span>}</td>
                                        <td className="px-5 py-3">
                                            <Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <EstadoVacio enTarjeta icono={busquedaDelServidor ? 'search_off' : 'inventory_2'}>
                                            {busquedaDelServidor ? `No se encontraron bienes para «${busquedaDelServidor}».` : 'Tu área no tiene bienes cargados.'}
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
