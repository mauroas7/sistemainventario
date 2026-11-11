import { Dato, Estado, EstadoVacio, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import ResumenTraslado from '@/Components/Patrimonio/ResumenTraslado';
import { tonoEstadoBien } from '@/utils/estados';

export default function Show({ bien, movimientos = [] }) {
    return (
        <AppLayout
            titulo={`Ficha del bien ${bien.codigo}`}
            subtitulo={bien.nombre}
            volver={{ href: route('patrimonio.bienes.index'), etiqueta: 'Volver al directorio' }}
            estado={<Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Tarjeta titulo="Datos del bien" icono="inventory_2" className="h-fit">
                    <div className="space-y-4 text-sm">
                        <Dato etiqueta="Código" valor={bien.codigo} />
                        <Dato etiqueta="N° Diaguita" valor={bien.numero_diaguita} siFalta="Sin cargar" />
                        <Dato etiqueta="Descripción" valor={bien.nombre} />
                        <Dato etiqueta="Detalle" valor={bien.descripcion} />
                        <div className="space-y-4 border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                            <Dato etiqueta="Ubicación actual" valor={bien.ubicacion_actual?.nombre} />
                            <Dato etiqueta="Área" valor={bien.area?.nombre} />
                            <Dato etiqueta="Responsable" valor={bien.responsable?.nombre} siFalta="Sin asignar" />
                        </div>
                    </div>
                </Tarjeta>

                <Tarjeta titulo="Registro de movimientos" icono="history" contador={movimientos.length} className="lg:col-span-2">
                    {movimientos.length > 0 ? (
                        <ol className="space-y-4">
                            {movimientos.map((m) => (
                                <li key={m.id} className="border-l-2 border-secondary pl-3">
                                    <ResumenTraslado m={m} />
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <EstadoVacio enTarjeta icono="history">No hay movimientos asociados a este bien.</EstadoVacio>
                    )}
                </Tarjeta>
            </div>
        </AppLayout>
    );
}
