import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Alerta, Boton, Dato, Estado, ModalConfirmar, Select, Tarjeta, useConfirmacion } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import { tonoEstadoMovimiento } from '@/utils/estados';
import { fechaYHora } from '@/utils/fechas';
import { puedeAcusar, puedeAnular, relacion } from '@/utils/movimientos';

export default function Show({ movimiento: m, responsables = [] }) {
    const usuario = usePage().props.auth.usuario;
    const esAdmin = usuario.rol === 'admin';
    const { confirmar, props: modal } = useConfirmacion();

    const [nuevoResponsable, setNuevoResponsable] = useState('');
    const [asignando, setAsignando] = useState(false);
    const [error, setError] = useState('');

    const avisoDeError = (mensajePorDefecto) => (errores) => setError(Object.values(errores)[0] || mensajePorDefecto);

    const acusa = puedeAcusar(m, usuario);
    const anula = puedeAnular(m, usuario);

    const asignarResponsable = (e) => {
        e.preventDefault();
        if (! nuevoResponsable) return;

        setAsignando(true);
        setError('');
        router.patch(route('patrimonio.movimientos.responsable', { movimiento: m.id }), { responsable_nuevo_id: nuevoResponsable }, {
            preserveScroll: true,
            onError: avisoDeError('No se pudo asignar el responsable'),
            onFinish: () => setAsignando(false),
        });
    };

    const acusar = () => {
        setError('');
        router.post(route('recepcion.confirmar', { movimiento: m.id }), {}, {
            preserveScroll: true,
            onError: avisoDeError('No se pudo completar la acción'),
        });
    };

    const anular = () => {
        setError('');
        confirmar({
            titulo: `Anular el ticket TK-${m.id}`,
            detalle: 'El bien vuelve a su ubicación y responsable anteriores. El ticket queda en el historial como anulado.',
            textoAceptar: 'Anular',
            accion: (r) => r.post(route('recepcion.anular', { movimiento: m.id }), {}, {
                preserveScroll: true,
                onError: avisoDeError('No se pudo completar la acción'),
            }),
        });
    };

    return (
        <AppLayout
            titulo={`Ticket TK-${m.id}`}
            subtitulo={`${m.bien.codigo} · Diaguita ${m.bien.numero_diaguita || 'sin cargar'} · ${m.bien.nombre}`}
            ancho="lectura"
        >
            <div className="mb-4">
                <Boton variante="fantasma" forma="grupo" icono="arrow_back" href={route('recepcion.bandeja')}>
                    Volver a la bandeja
                </Boton>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Tarjeta titulo="Estado del movimiento" icono="flag" className="h-fit">
                    <div className="space-y-4 text-sm">
                        <Dato etiqueta="Estado" valor={<Estado tono={tonoEstadoMovimiento(m.estado_movimiento.nombre)}>{m.estado_movimiento.nombre}</Estado>} />
                        <Dato etiqueta="Relación" valor={relacion(m, usuario)} />
                        <Dato etiqueta="Origen" valor={m.area_origen.nombre} />
                        <Dato etiqueta="Destino" valor={m.area_destino.nombre} />
                    </div>
                </Tarjeta>

                <Tarjeta titulo="Datos del ticket" icono="receipt_long" className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <Dato etiqueta="Informado por" valor={m.creado_por?.nombre} />
                        <Dato etiqueta="Acuse de recibo" valor={m.recibido_por?.nombre} siFalta="Sin acusar" />
                        <Dato etiqueta="Responsable anterior" valor={m.responsable_anterior?.nombre} siFalta="Sin asignar" />
                        <Dato etiqueta="Quedó a cargo" valor={m.responsable_nuevo?.nombre} siFalta="A definir por Gestión de Bienes" />
                        <Dato etiqueta="Tipo" valor={m.tipo_movimiento.nombre} />
                        <Dato etiqueta="Motivo" valor={m.motivo.nombre} />
                        <Dato etiqueta="Fecha del movimiento" valor={fechaYHora(m.fecha_movimiento)} />
                        <Dato etiqueta="Fecha de recepción" valor={m.fecha_recepcion && fechaYHora(m.fecha_recepcion)} />
                        <Dato etiqueta="Observaciones" valor={m.observaciones_salida} className="md:col-span-2" />

                        {m.imagen_salida_url && (
                            <Dato
                                etiqueta="Foto del bien al salir"
                                className="md:col-span-2"
                                valor={
                                    <a href={m.imagen_salida_url} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
                                        <img
                                            src={m.imagen_salida_url}
                                            alt="Estado del bien al salir"
                                            className="h-48 w-auto rounded-xl border border-brandText-soft/70 object-cover transition-opacity hover:opacity-90 dark:border-gray-800"
                                        />
                                    </a>
                                }
                            />
                        )}
                    </div>

                    {! m.responsable_nuevo && (
                        <Alerta tipo="aviso" titulo="Este movimiento no tiene responsable definido" className="mt-6">
                            El bien figura en {m.area_destino.nombre}, pero nadie quedó a cargo.
                            {esAdmin ? ' Definí quién lo recibe para poder emitir la ficha de firmas.' : ' Gestión de Bienes va a definir el responsable.'}

                            {esAdmin && (responsables.length > 0 ? (
                                <form onSubmit={asignarResponsable} className="mt-3 flex flex-wrap items-end gap-3">
                                    <Select
                                        nombre="responsable_nuevo_id"
                                        etiqueta="Responsable"
                                        opciones={responsables.map((r) => [r.id, r.name])}
                                        valor={nuevoResponsable}
                                        onChange={(e) => setNuevoResponsable(e.target.value)}
                                        vacio="Elegí el responsable"
                                    />
                                    <Boton disabled={! nuevoResponsable || asignando}>
                                        {asignando ? 'Asignando…' : 'Asignar responsable'}
                                    </Boton>
                                </form>
                            ) : (
                                <p className="mt-3">
                                    {m.area_destino.nombre} no tiene usuarios registrados. Creá la cuenta desde Configuración para poder asignarle el bien.
                                </p>
                            ))}
                        </Alerta>
                    )}

                    <div className="mt-6 border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                        {error && <Alerta tipo="error" className="mb-4">{error}</Alerta>}

                        {acusa || anula ? (
                            <div className="flex flex-wrap gap-3">
                                {acusa && (
                                    <Boton tipo="button" icono="task_alt" onClick={acusar}>
                                        Acusar recibo
                                    </Boton>
                                )}
                                {anula && (
                                    <Boton tipo="button" variante="peligro" icono="block" onClick={anular}>
                                        Anular movimiento
                                    </Boton>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">
                                {m.estado_movimiento.nombre === 'Anulado'
                                    ? 'Este movimiento fue anulado.'
                                    : m.recibido_por
                                        ? 'El movimiento ya tiene acuse de recibo.'
                                        : 'Sin acciones disponibles para tu rol.'}
                            </p>
                        )}
                    </div>
                </Tarjeta>
            </div>

            <ModalConfirmar {...modal} />
        </AppLayout>
    );
}
