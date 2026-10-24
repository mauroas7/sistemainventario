import { Boton, Dato, Estado, EstadoVacio, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

export default function Show({ bien, movimientos = [] }) {
    return (
        <AppLayout titulo="Ficha y registro histórico" subtitulo={`Bien #${bien.codigo} - ${bien.nombre}`} ancho="lectura">
            <div className="mb-4">
                <Boton variante="fantasma" forma="grupo" icono="arrow_back" href={route('patrimonio.bienes.index')}>
                    Volver al directorio
                </Boton>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Tarjeta titulo="Datos del bien" icono="inventory_2" className="h-fit">
                    <div className="space-y-4 text-sm">
                        <Dato etiqueta="Código" valor={bien.codigo} />
                        <Dato etiqueta="Descripción" valor={bien.nombre} />
                        <Dato etiqueta="Detalle" valor={bien.descripcion} />
                        <Dato etiqueta="Ubicación actual" valor={bien.ubicacion_actual?.nombre} className="border-t border-brandText-soft/70 pt-4 dark:border-gray-800" />
                    </div>
                </Tarjeta>

                <Tarjeta titulo="Registro de movimientos" icono="history" contador={movimientos.length} className="lg:col-span-2">
                    {movimientos.length > 0 ? (
                        <ul className="space-y-3">
                            {movimientos.map((m) => (
                                <li key={m.id} className="rounded-xl bg-canvas p-4 dark:bg-white/5">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-semibold text-primary dark:text-gray-100">TK-{m.id}</p>
                                        <Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>
                                    </div>
                                    <p className="mt-1 text-sm">{m.area_origen.nombre} → {m.area_destino.nombre}</p>
                                    <p className="mt-2 text-xs text-brandText-muted dark:text-brandText-mutedDark">{fechaYHora(m.fecha_movimiento)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EstadoVacio enTarjeta icono="history">No hay movimientos asociados a este bien.</EstadoVacio>
                    )}
                </Tarjeta>
            </div>
        </AppLayout>
    );
}
