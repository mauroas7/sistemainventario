import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Alerta, Boton, Input, Select, Tarjeta, Textarea } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import FotoDelBien from '@/Components/Envio/FotoDelBien';
import ResumenMovimiento from '@/Components/Envio/ResumenMovimiento';

const FORM_VACIO = {
    bien_id: '',
    tipo_movimiento_id: '',
    motivo_id: '',
    area_origen_id: '',
    area_destino_id: '',
    responsable_nuevo_id: '',
    observaciones_salida: '',
};

const porId = (lista, id) => lista.find((item) => String(item.id) === String(id));
const pares = (lista, etiqueta = (item) => item.nombre) => lista.map((item) => [item.id, etiqueta(item)]);

export default function Create({ bienes = [], areas = [], tiposMovimiento = [], motivos = [], responsables = [] }) {
    const usuario = usePage().props.auth.usuario;
    const esAdmin = usuario.rol === 'admin';

    const [form, setForm] = useState(FORM_VACIO);
    const [imagen, setImagen] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [enviando, setEnviando] = useState(false);

    // El origen no es una elección libre: es la ubicación actual del bien seleccionado.
    // Si el destino ya elegido queda invalidado por el nuevo origen, se limpia.
    useEffect(() => {
        const areaOrigenId = porId(bienes, form.bien_id) ? String(porId(bienes, form.bien_id).area_id) : '';

        setForm((f) => {
            if (f.area_origen_id === areaOrigenId) return f;
            const destinoInvalido = f.area_destino_id && f.area_destino_id === areaOrigenId;
            return { ...f, area_origen_id: areaOrigenId, area_destino_id: destinoInvalido ? '' : f.area_destino_id };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bienes, form.bien_id]);

    // Al cambiar el destino, el responsable elegido puede pertenecer a otra área:
    // se limpia para no arrastrar una asignación que ya no corresponde.
    useEffect(() => {
        setForm((f) => {
            if (! f.responsable_nuevo_id) return f;

            const elegido = porId(responsables, f.responsable_nuevo_id);
            return elegido && String(elegido.area_id) === String(f.area_destino_id) ? f : { ...f, responsable_nuevo_id: '' };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responsables, form.area_destino_id]);

    const areasDestino = (esAdmin ? areas : areas.filter((a) => String(a.nombre).toLowerCase() !== 'dirección'))
        .filter((a) => String(a.id) !== String(form.area_origen_id));

    const bien = porId(bienes, form.bien_id);
    const areaOrigen = porId(areas, form.area_origen_id);
    const areaDestino = porId(areas, form.area_destino_id);
    const responsableNuevo = porId(responsables, form.responsable_nuevo_id);
    const responsableActual = porId(responsables, bien?.responsable_id);

    // El bien pasa a estar a cargo de alguien del área que lo recibe: ofrecer gente de
    // otras áreas sólo habilita cargar un responsable que no corresponde.
    const responsablesDestino = form.area_destino_id
        ? responsables.filter((r) => String(r.area_id) === String(form.area_destino_id))
        : [];

    const limpiarError = (campo) => setErrors(({ [campo]: _quitado, ...resto }) => resto);

    const cambiar = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        limpiarError(name);
    };

    const validar = () => {
        const errores = {};
        if (! form.bien_id) errores.bien_id = 'Elegí un bien.';
        if (! form.tipo_movimiento_id) errores.tipo_movimiento_id = 'Elegí un tipo de movimiento.';
        if (! form.area_destino_id) errores.area_destino_id = 'Elegí el área de destino.';
        if (! form.motivo_id) errores.motivo_id = 'Elegí un motivo.';
        return errores;
    };

    const enviar = (e) => {
        e.preventDefault();

        const errores = validar();
        setErrorGeneral('');
        setErrors(errores);
        if (Object.keys(errores).length > 0) return;

        const datos = {
            bien_id: form.bien_id,
            area_origen_id: form.area_origen_id,
            area_destino_id: form.area_destino_id,
            tipo_movimiento_id: form.tipo_movimiento_id,
            motivo_id: form.motivo_id,
        };
        if (form.responsable_nuevo_id) datos.responsable_nuevo_id = form.responsable_nuevo_id;
        if (form.observaciones_salida) datos.observaciones_salida = form.observaciones_salida;
        if (imagen) datos.imagen = imagen;

        setEnviando(true);
        router.post(route('envio.store'), datos, {
            onError: (erroresServidor) => {
                setErrors(erroresServidor ?? {});
                if (! erroresServidor || Object.keys(erroresServidor).length === 0) setErrorGeneral('No se pudo crear el ticket.');
            },
            onFinish: () => setEnviando(false),
        });
    };

    const ayudaResponsable = ! form.area_destino_id
        ? null
        : responsablesDestino.length === 0
            ? `${areaDestino?.nombre} no tiene usuarios registrados en el sistema. El movimiento se informa igual y Gestión de Bienes define el responsable.`
            : `Personal de ${areaDestino?.nombre}. Es quien deberá firmar la nueva ficha de inventario; si todavía no está definido, dejá la opción por defecto.`;

    return (
        <AppLayout titulo="Nuevo movimiento de bien" subtitulo="Envío · Crear ticket">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Tarjeta titulo="Datos del traslado" icono="local_shipping" className="lg:col-span-2">
                    <form className="space-y-5" onSubmit={enviar} noValidate>
                        {errorGeneral && <Alerta tipo="error">{errorGeneral}</Alerta>}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Select
                                nombre="bien_id"
                                etiqueta="Bien"
                                requerido
                                opciones={pares(bienes, (b) => `${b.codigo} - ${b.nombre}`)}
                                valor={form.bien_id}
                                onChange={cambiar}
                                error={errors.bien_id}
                                vacio="Elegí un bien"
                            />
                            <Input
                                nombre="responsable_actual"
                                etiqueta="Responsable actual del bien"
                                valor={responsableActual?.name || (bien ? 'Sin responsable asignado' : 'Se completa al elegir el bien')}
                                readOnly
                            />
                        </div>

                        {bien && (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <Input nombre="codigo" etiqueta="N° inventario (interno)" valor={bien.codigo || '—'} readOnly />
                                <Input nombre="numero_diaguita" etiqueta="N° Diaguita" valor={bien.numero_diaguita || 'Sin cargar en Diaguita'} readOnly />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Input
                                nombre="area_origen"
                                etiqueta="Origen (ubicación actual del bien)"
                                valor={areaOrigen?.nombre || 'Se completa al elegir el bien'}
                                readOnly
                            />
                            <Select
                                nombre="tipo_movimiento_id"
                                etiqueta="Tipo de movimiento"
                                requerido
                                opciones={pares(tiposMovimiento)}
                                valor={form.tipo_movimiento_id}
                                onChange={cambiar}
                                error={errors.tipo_movimiento_id}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Select
                                nombre="area_destino_id"
                                etiqueta="Destino"
                                requerido
                                opciones={pares(areasDestino)}
                                valor={form.area_destino_id}
                                onChange={cambiar}
                                error={errors.area_destino_id}
                                disabled={! form.area_origen_id}
                                vacio={form.area_origen_id ? 'Elegí una opción' : 'Elegí primero un bien'}
                            />
                            <Select
                                nombre="motivo_id"
                                etiqueta="Motivo"
                                requerido
                                opciones={pares(motivos)}
                                valor={form.motivo_id}
                                onChange={cambiar}
                                error={errors.motivo_id}
                            />
                        </div>

                        <Select
                            nombre="responsable_nuevo_id"
                            etiqueta="Nuevo responsable"
                            opciones={pares(responsablesDestino, (r) => r.name)}
                            valor={form.responsable_nuevo_id}
                            onChange={cambiar}
                            error={errors.responsable_nuevo_id}
                            ayuda={ayudaResponsable}
                            disabled={! form.area_destino_id}
                            vacio={form.area_destino_id ? 'A definir por Gestión de Bienes' : 'Elegí primero el destino'}
                        />

                        <FotoDelBien
                            imagen={imagen}
                            onCambiar={(archivo) => {
                                limpiarError('imagen');
                                setImagen(archivo);
                            }}
                            error={errors.imagen}
                            onError={(mensaje) => setErrors((prev) => ({ ...prev, imagen: mensaje }))}
                        />

                        <Textarea
                            nombre="observaciones_salida"
                            etiqueta="Observaciones"
                            valor={form.observaciones_salida}
                            onChange={cambiar}
                            error={errors.observaciones_salida}
                        />

                        <div className="flex items-center gap-3 pt-2">
                            <Boton disabled={enviando}>{enviando ? 'Creando…' : 'Crear ticket'}</Boton>
                            <Boton variante="fantasma" forma="grupo" href={route('inicio')}>
                                Cancelar
                            </Boton>
                        </div>
                    </form>
                </Tarjeta>

                <ResumenMovimiento
                    bien={bien}
                    areaOrigen={areaOrigen}
                    areaDestino={areaDestino}
                    responsableActual={responsableActual}
                    responsableNuevo={responsableNuevo}
                    tipo={porId(tiposMovimiento, form.tipo_movimiento_id)}
                    motivo={porId(motivos, form.motivo_id)}
                    informante={usuario.nombre}
                />
            </div>
        </AppLayout>
    );
}
