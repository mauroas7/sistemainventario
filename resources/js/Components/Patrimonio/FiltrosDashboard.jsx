import { Boton, Buscador, Select, SelectorFecha } from 'hu-kit/componentes';

const pares = (lista) => lista.map((item) => [item.id, item.nombre]);

/** Los filtros del control patrimonial: se aplican con «Filtrar» o Enter, desde `Dashboard`. */
export default function FiltrosDashboard({ filtros, setFiltro, areas, estados, motivos, hayFiltrosActivos, onFiltrar, onLimpiar }) {
    return (
        <form
            onSubmit={onFiltrar}
            className="mb-4 grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]"
        >
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
            <div className="flex items-end gap-2 sm:col-span-2 2xl:col-span-1">
                <Boton tipo="submit" forma="grupo">Filtrar</Boton>
                {hayFiltrosActivos && (
                    <Boton tipo="button" variante="fantasma" forma="grupo" icono="filter_alt_off" onClick={onLimpiar}>
                        Limpiar filtros
                    </Boton>
                )}
            </div>
        </form>
    );
}
