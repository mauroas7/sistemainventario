import { Boton, Dato, Estado, Rotulo, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';

export default function Show({ movimiento: m }) {
    return (
        <AppLayout titulo={`Auditoría del ticket TK-${m.id}`} subtitulo={`${m.bien.codigo} · ${m.bien.nombre}`}>
            <div className="mb-4">
                <Boton variante="fantasma" forma="grupo" icono="arrow_back" href={route('patrimonio.dashboard')}>
                    Volver al dashboard
                </Boton>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Tarjeta titulo="Identificación del bien" icono="inventory_2">
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <Dato
                                etiqueta="Bien"
                                valor={`${m.bien.codigo} - ${m.bien.nombre}`}
                                detalle={`Diaguita: ${m.bien.numero_diaguita || 'sin cargar'}`}
                            />
                            <Dato
                                etiqueta="Estado"
                                valor={<Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>}
                            />
                        </div>
                    </Tarjeta>

                    <Tarjeta titulo="Detalles del movimiento" icono="swap_horiz">
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <Dato etiqueta="Área de origen" valor={m.area_origen.nombre} />
                            <Dato etiqueta="Área de destino" valor={m.area_destino.nombre} />
                            <Dato etiqueta="Motivo" valor={m.motivo.nombre} className="sm:col-span-2" />
                            <Dato etiqueta="Observaciones" valor={m.observaciones_salida} className="sm:col-span-2" />
                            {m.imagen_salida_url && (
                                <Dato
                                    etiqueta="Foto del bien al salir"
                                    className="sm:col-span-2"
                                    valor={
                                        <a href={m.imagen_salida_url} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
                                            <img
                                                src={m.imagen_salida_url}
                                                alt="Estado del bien al salir"
                                                className="h-48 w-auto rounded-xl border border-brandText-soft/70 object-cover dark:border-gray-800"
                                            />
                                        </a>
                                    }
                                />
                            )}
                        </div>
                    </Tarjeta>
                </div>

                <Tarjeta titulo="Cadena de custodia" icono="verified" className="h-fit">
                    <div className="space-y-4 text-sm">
                        <Dato etiqueta="Informado por" valor={m.creado_por?.nombre} />
                        <Dato etiqueta="Responsable anterior" valor={m.responsable_anterior?.nombre} siFalta="Sin asignar" />
                        <Dato etiqueta="Quedó a cargo" valor={m.responsable_nuevo?.nombre} siFalta="Sin asignar" />
                        <Dato etiqueta="Registrado en Diaguita" valor={m.fecha_registro_diaguita && fechaYHora(m.fecha_registro_diaguita)} siFalta="Pendiente" />
                        <Dato etiqueta="Fecha del movimiento" valor={fechaYHora(m.fecha_movimiento)} />
                        <Dato etiqueta="Acuse de recibo" valor={m.fecha_recepcion && fechaYHora(m.fecha_recepcion)} siFalta="Sin acusar" />
                    </div>

                    <div className="mt-6 border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                        <Rotulo como="h3" className="mb-3 block">Historial de estados</Rotulo>

                        {m.historial_estados?.length ? (
                            <ol className="space-y-3">
                                {m.historial_estados.map((cambio) => (
                                    <li key={cambio.id} className="border-l-2 border-secondary pl-3">
                                        <p className="text-sm font-semibold text-primary dark:text-gray-100">
                                            {cambio.estado_anterior ? `${cambio.estado_anterior} → ${cambio.estado_nuevo}` : `Alta como «${cambio.estado_nuevo}»`}
                                        </p>
                                        <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">
                                            {fechaYHora(cambio.fecha)} · {cambio.usuario || 'sin usuario registrado'}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">Sin cambios de estado registrados.</p>
                        )}
                    </div>
                </Tarjeta>
            </div>
        </AppLayout>
    );
}
