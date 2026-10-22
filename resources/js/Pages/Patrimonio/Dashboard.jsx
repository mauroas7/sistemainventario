import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Metrica, Paginador, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import FiltrosDashboard from '@/Components/Patrimonio/FiltrosDashboard';
import TablaControl from '@/Components/Patrimonio/TablaControl';

const FILTROS_VACIOS = {
    area_id: '',
    estado_movimiento_id: '',
    motivo_id: '',
    desde: '',
    hasta: '',
    bien: '',
};

const soloConValor = (filtros) =>
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined));

export default function Dashboard({ movimientos, resumen, filtros: filtrosDelServidor = {}, estados = [], areas = [], motivos = [] }) {
    const { auth, errors } = usePage().props;
    const aplicados = Object.fromEntries(
        Object.entries({ ...FILTROS_VACIOS, ...filtrosDelServidor }).map(([clave, valor]) => [clave, valor ?? '']),
    );

    // `filtros` es lo que el usuario está tipeando; `aplicados` es lo que ya se consultó.
    const [filtros, setFiltros] = useState(aplicados);
    const [elegidos, setElegidos] = useState({});
    const errorFiltros = Object.keys(FILTROS_VACIOS).map((clave) => errors?.[clave]).filter(Boolean).join(' ');
    const hayFiltrosActivos = Object.values(aplicados).some((valor) => valor !== '');

    // Filtros y página viajan en la URL: una vista filtrada se puede recargar o compartir.
    const visitar = (params) => {
        router.get(route('patrimonio.dashboard'), soloConValor(params), { preserveState: true, preserveScroll: true });
    };

    const estadoElegido = (m) => elegidos[m.id] ?? m.estado_movimiento.id;

    // El cambio de estado puede mover los totales y la página del movimiento: vuelve
    // la vista entera en vez de parchear la fila.
    const guardarEstado = (m) => {
        router.patch(route('patrimonio.movimientos.estado', { movimiento: m.id }), { estado_movimiento_id: estadoElegido(m) }, {
            preserveScroll: true,
            onSuccess: () => setElegidos({}),
            onError: (errores) => alert(Object.values(errores)[0] || 'No se pudo actualizar el estado'),
        });
    };

    return (
        <AppLayout titulo="Control patrimonial" subtitulo={`${auth.usuario.nombre} · ${auth.usuario.rolEtiqueta}`}>
            <FiltrosDashboard
                filtros={filtros}
                setFiltro={(clave, valor) => setFiltros((f) => ({ ...f, [clave]: valor }))}
                areas={areas}
                estados={estados}
                motivos={motivos}
                error={errorFiltros}
                total={resumen.total}
                hayFiltrosActivos={hayFiltrosActivos}
                onAplicar={(e) => {
                    e.preventDefault();
                    visitar(filtros);
                }}
                onLimpiar={() => {
                    setFiltros(FILTROS_VACIOS);
                    visitar(FILTROS_VACIOS);
                }}
                onExportar={() => {
                    window.location.href = route('patrimonio.dashboard.exportar', soloConValor(aplicados));
                }}
            />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Metrica valor={resumen.total} etiqueta="Total" icono="list_alt" />
                <Metrica valor={resumen.informados} etiqueta="A cargar en Diaguita" icono="schedule" tono="aviso" />
                <Metrica valor={resumen.registrados} etiqueta="Registrados" icono="inventory" />
                <Metrica valor={resumen.cerrados} etiqueta="Cerrados" icono="check_circle" tono="exito" />
                <Metrica valor={resumen.anulados} etiqueta="Anulados" icono="cancel" tono="error" />
            </div>

            <Tarjeta titulo="Movimientos" icono="swap_horiz" contador={movimientos.total}>
                <TablaControl
                    movimientos={movimientos.data}
                    estados={estados}
                    estadoElegido={estadoElegido}
                    onElegirEstado={(id, valor) => setElegidos((prev) => ({ ...prev, [id]: valor }))}
                    onGuardarEstado={guardarEstado}
                    hayFiltrosActivos={hayFiltrosActivos}
                />

                <div className="mt-4 empty:hidden">
                    <Paginador paginador={movimientos} />
                </div>
            </Tarjeta>
        </AppLayout>
    );
}
