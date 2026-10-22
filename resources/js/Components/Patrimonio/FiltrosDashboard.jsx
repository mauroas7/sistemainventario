import { Alerta, Boton, Input, Select, SelectorFecha, Tarjeta } from 'hu-kit/componentes';

const pares = (lista) => lista.map((item) => [item.id, item.nombre]);

/** Los filtros del control patrimonial. Aplicarlos es una visita: quedan en la URL. */
export default function FiltrosDashboard({ filtros, setFiltro, areas, estados, motivos, error, total, hayFiltrosActivos, onAplicar, onLimpiar, onExportar }) {
    return (
        <Tarjeta titulo="Filtros del dashboard" icono="filter_alt" className="mb-6">
            <form onSubmit={onAplicar}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Select
                        nombre="area_id"
                        etiqueta="Sector (origen o destino)"
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
                    <SelectorFecha nombre="desde" etiqueta="Desde" valor={filtros.desde} onChange={(valor) => setFiltro('desde', valor)} limpiable />
                    <SelectorFecha nombre="hasta" etiqueta="Hasta" valor={filtros.hasta} onChange={(valor) => setFiltro('hasta', valor)} limpiable />
                    <Input
                        nombre="bien"
                        etiqueta="Bien (código o nombre)"
                        valor={filtros.bien}
                        onChange={(e) => setFiltro('bien', e.target.value)}
                        placeholder="Ej: MON001 o Monitor"
                    />
                </div>

                {error && <Alerta tipo="error" className="mt-4">{error}</Alerta>}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Boton>Aplicar filtros</Boton>
                    <Boton tipo="button" variante="fantasma" forma="grupo" onClick={onLimpiar}>
                        Limpiar
                    </Boton>
                    <Boton tipo="button" variante="contorno" forma="grupo" icono="download" onClick={onExportar}>
                        Exportar CSV
                    </Boton>
                    {hayFiltrosActivos && (
                        <span className="text-sm font-semibold text-primary dark:text-gray-100">
                            Vista filtrada · {total} movimiento{total === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
            </form>
        </Tarjeta>
    );
}
