import { Buscador, Select, SelectorFecha } from 'hu-kit/componentes';

const pares = (lista) => lista.map((item) => [item.id, item.nombre]);

/** Los filtros del control patrimonial: cada cambio se aplica solo, desde `Dashboard`. */
export default function FiltrosDashboard({ filtros, setFiltro, areas, estados, motivos }) {
    return (
        <div className="mb-4 grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            <Buscador
                nombre="bien"
                etiqueta="Bien (código o nombre)"
                valor={filtros.bien}
                onChange={(valor) => setFiltro('bien', valor)}
                placeholder="Ej: MON001 o Monitor"
            />
            <Select
                nombre="area_id"
                etiqueta="Área (origen o destino)"
                opciones={pares(areas)}
                valor={filtros.area_id}
                onChange={(e) => setFiltro('area_id', e.target.value)}
                vacio="Todos"
            />
            <Select
                nombre="estado_movimiento_id"
                etiqueta="Estado"
                opciones={pares(estados)}
                valor={filtros.estado_movimiento_id}
                onChange={(e) => setFiltro('estado_movimiento_id', e.target.value)}
                vacio="Todos"
            />
            <Select
                nombre="motivo_id"
                etiqueta="Motivo del traslado"
                opciones={pares(motivos)}
                valor={filtros.motivo_id}
                onChange={(e) => setFiltro('motivo_id', e.target.value)}
                vacio="Todos"
            />
            <SelectorFecha
                nombre="desde"
                etiqueta="Desde"
                valor={filtros.desde}
                hasta={filtros.hasta || null}
                onChange={(valor) => setFiltro('desde', valor)}
                limpiable
            />
            <SelectorFecha
                nombre="hasta"
                etiqueta="Hasta"
                valor={filtros.hasta}
                desde={filtros.desde || null}
                onChange={(valor) => setFiltro('hasta', valor)}
                limpiable
            />
        </div>
    );
}
