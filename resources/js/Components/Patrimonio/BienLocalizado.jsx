import { Boton, Dato, Estado, Rotulo, Tarjeta } from 'hu-kit/componentes';
import ResumenTraslado from '@/Components/Patrimonio/ResumenTraslado';
import { tonoEstadoBien } from '@/utils/estados';

/** Un resultado del localizador: dónde está el bien y cómo llegó con su último traslado. */
export default function BienLocalizado({ bien, ultimo }) {
    return (
        <Tarjeta
            titulo={`${bien.codigo} · ${bien.nombre}`}
            icono="inventory_2"
            acciones={
                <Boton variante="fantasma" forma="grupo" icono="inventory_2" href={route('patrimonio.bienes.show', { bien: bien.id })}>
                    Ver ficha
                </Boton>
            }
        >
            {bien.descripcion && <p className="mb-4 text-sm">{bien.descripcion}</p>}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                    <Rotulo como="h3" className="mb-2 block">Dónde está</Rotulo>
                    <p className="mb-4 text-lg font-semibold text-primary dark:text-gray-100">
                        {bien.ubicacion_actual?.nombre || bien.area?.nombre}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Dato etiqueta="Área" valor={bien.area?.nombre} />
                        <Dato etiqueta="Responsable" valor={bien.responsable?.nombre} siFalta="Sin asignar" />
                        <Dato etiqueta="Estado del bien" valor={<Estado tono={tonoEstadoBien(bien.estado?.nombre)}>{bien.estado?.nombre || '—'}</Estado>} />
                        <Dato etiqueta="N° Diaguita" valor={bien.numero_diaguita} siFalta="Sin cargar" />
                    </div>
                </div>

                <div className="border-t border-brandText-soft/70 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-gray-800">
                    <Rotulo como="h3" className="mb-2 block">Último traslado</Rotulo>
                    {ultimo ? (
                        <ResumenTraslado m={ultimo} />
                    ) : (
                        <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">Sin traslados: el bien está donde se dio de alta.</p>
                    )}
                </div>
            </div>
        </Tarjeta>
    );
}
