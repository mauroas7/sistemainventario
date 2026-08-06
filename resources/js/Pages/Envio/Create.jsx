import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { PhotoIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

const FORM_VACIO = {
    bien_id: '',
    tipo_movimiento_id: '',
    motivo_id: '',
    area_origen_id: '',
    area_destino_id: '',
    responsable_nuevo_id: '',
    observaciones_salida: '',
};

export default function Create({ bienes = [], areas = [], tiposMovimiento = [], motivos = [], responsables = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const isAdmin = user.rol === 'admin';
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(FORM_VACIO);
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [enviando, setEnviando] = useState(false);

    // El origen no es una elección libre: es la ubicación actual del bien seleccionado.
    // Si el destino ya elegido queda invalidado por el nuevo origen, se limpia.
    useEffect(() => {
        const bienSeleccionado = bienes.find(b => String(b.id) === String(form.bien_id));
        const areaOrigenId = bienSeleccionado ? String(bienSeleccionado.area_id) : '';

        setForm(f => {
            if (f.area_origen_id === areaOrigenId) return f;
            const destinoInvalido = f.area_destino_id && f.area_destino_id === areaOrigenId;
            return { ...f, area_origen_id: areaOrigenId, area_destino_id: destinoInvalido ? '' : f.area_destino_id };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bienes, form.bien_id]);

    // Al cambiar el destino, el responsable elegido puede pertenecer a otra área:
    // se limpia para no arrastrar una asignación que ya no corresponde.
    useEffect(() => {
        setForm(f => {
            if (!f.responsable_nuevo_id) return f;

            const elegido = responsables.find(r => String(r.id) === String(f.responsable_nuevo_id));
            const sigueSiendoValido = elegido && String(elegido.area_id) === String(f.area_destino_id);

            return sigueSiendoValido ? f : { ...f, responsable_nuevo_id: '' };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responsables, form.area_destino_id]);

    useEffect(() => {
        if (!imagen) {
            setImagenPreview(null);
            return;
        }

        const url = URL.createObjectURL(imagen);
        setImagenPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imagen]);

    const destinationAreas = (isAdmin
        ? areas
        : areas.filter(a => String(a.nombre).toLowerCase() !== 'dirección')
    ).filter(a => String(a.id) !== String(form.area_origen_id));

    const bienSeleccionado = bienes.find(b => String(b.id) === String(form.bien_id));
    const areaOrigen = areas.find(a => String(a.id) === String(form.area_origen_id));
    const areaDestino = areas.find(a => String(a.id) === String(form.area_destino_id));
    const tipoSeleccionado = tiposMovimiento.find(t => String(t.id) === String(form.tipo_movimiento_id));
    const motivoSeleccionado = motivos.find(m => String(m.id) === String(form.motivo_id));
    const responsableNuevo = responsables.find(r => String(r.id) === String(form.responsable_nuevo_id));
    const responsableActual = responsables.find(r => String(r.id) === String(bienSeleccionado?.responsable_id));

    // El bien pasa a estar a cargo de alguien del área que lo recibe: ofrecer gente de
    // otras áreas solo habilita cargar un responsable que no corresponde.
    const responsablesDestino = form.area_destino_id
        ? responsables.filter(r => String(r.area_id) === String(form.area_destino_id))
        : [];

    function limpiarError(campo) {
        setErrors(prev => {
            if (!prev[campo]) return prev;
            const { [campo]: _quitado, ...resto } = prev;
            return resto;
        });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        limpiarError(name);
    }

    function handleImagenChange(e) {
        const archivo = e.target.files?.[0] || null;
        limpiarError('imagen');

        if (!archivo) {
            setImagen(null);
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
            setErrors(prev => ({ ...prev, imagen: 'El archivo debe ser una imagen (JPG, PNG o WEBP).' }));
            e.target.value = '';
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, imagen: 'La imagen no puede pesar más de 5 MB.' }));
            e.target.value = '';
            return;
        }

        setImagen(archivo);
    }

    function quitarImagen() {
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function validar() {
        const errores = {};
        if (!form.bien_id) errores.bien_id = 'Seleccione un bien.';
        if (!form.tipo_movimiento_id) errores.tipo_movimiento_id = 'Seleccione un tipo de movimiento.';
        if (!form.area_destino_id) errores.area_destino_id = 'Seleccione el área de destino.';
        if (!form.motivo_id) errores.motivo_id = 'Seleccione un motivo.';
        // El responsable es opcional: ver la nota en TicketController::store.
        return errores;
    }

    function handleSubmit(e) {
        e.preventDefault();

        const erroresValidacion = validar();
        if (Object.keys(erroresValidacion).length > 0) {
            setErrors(erroresValidacion);
            setErrorGeneral('');
            return;
        }

        setErrors({});
        setErrorGeneral('');
        setEnviando(true);

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

        // Va por el router de Inertia y no por fetch(): el token CSRF lo toma de la
        // cookie XSRF-TOKEN, que el servidor mantiene al día. El <meta name="csrf-token">
        // se renderiza una sola vez y queda viejo apenas el login rota la sesión, con lo
        // que un fetch() manual terminaba siempre en 419. El backend ya responde a esto
        // con un redirect a la bandeja.
        router.post('/envio/crear-ticket', datos, {
            onError: (erroresServidor) => {
                setErrors(erroresServidor || {});
                if (!erroresServidor || Object.keys(erroresServidor).length === 0) {
                    setErrorGeneral('No se pudo crear el ticket.');
                }
            },
            onFinish: () => setEnviando(false),
        });
    }

    function claseCampo(campo) {
        return `w-full rounded-lg text-gray-700 shadow-sm sm:text-sm ${
            errors[campo]
                ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-institucional-primario focus:ring-institucional-primario'
        }`;
    }

    return (
        <SidebarLayout>
            <Head title="Crear Ticket de Envío" />
            <div className="max-w-full">
                <h2 className="mb-6 text-2xl font-bold text-institucional-primario">Nuevo movimiento de bien</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            {errorGeneral && (
                                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
                                    <p>{errorGeneral}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="bien_id" className="mb-1 block text-sm font-medium text-blue-900/70">Bien *</label>
                                    <select id="bien_id" name="bien_id" value={form.bien_id} onChange={handleChange} className={claseCampo('bien_id')}>
                                        <option value="">Seleccione un bien</option>
                                        {bienes.map(b => <option key={b.id} value={b.id}>{b.codigo} - {b.nombre}</option>)}
                                    </select>
                                    {errors.bien_id && <p className="mt-1 text-xs text-red-600">{errors.bien_id}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-blue-900/70">Responsable actual del bien</label>
                                    <input
                                        readOnly
                                        value={responsableActual?.name || (bienSeleccionado ? 'Sin responsable asignado' : 'Se completa al seleccionar el bien')}
                                        className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {bienSeleccionado && (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-blue-900/70">N° inventario (interno)</label>
                                        <input readOnly value={bienSeleccionado.codigo || '—'} className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-blue-900/70">N° Diaguita</label>
                                        <input
                                            readOnly
                                            value={bienSeleccionado.numero_diaguita || 'Sin cargar en Diaguita'}
                                            className={`w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:ring-0 sm:text-sm ${bienSeleccionado.numero_diaguita ? 'text-gray-700' : 'italic text-gray-400'}`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-blue-900/70">Origen (ubicación actual del bien)</label>
                                    <input readOnly value={areaOrigen?.nombre || 'Se completa al seleccionar el bien'} className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-700 shadow-sm focus:ring-0 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="tipo_movimiento_id" className="mb-1 block text-sm font-medium text-blue-900/70">Tipo de movimiento *</label>
                                    <select id="tipo_movimiento_id" name="tipo_movimiento_id" value={form.tipo_movimiento_id} onChange={handleChange} className={claseCampo('tipo_movimiento_id')}>
                                        <option value="">Seleccione</option>
                                        {tiposMovimiento.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                    </select>
                                    {errors.tipo_movimiento_id && <p className="mt-1 text-xs text-red-600">{errors.tipo_movimiento_id}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="area_destino_id" className="mb-1 block text-sm font-medium text-blue-900/70">Destino *</label>
                                    <select id="area_destino_id" name="area_destino_id" value={form.area_destino_id} onChange={handleChange} disabled={!form.area_origen_id} className={`${claseCampo('area_destino_id')} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}>
                                        <option value="">{form.area_origen_id ? 'Seleccione' : 'Seleccione primero un bien'}</option>
                                        {destinationAreas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                    </select>
                                    {errors.area_destino_id && <p className="mt-1 text-xs text-red-600">{errors.area_destino_id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="motivo_id" className="mb-1 block text-sm font-medium text-blue-900/70">Motivo *</label>
                                    <select id="motivo_id" name="motivo_id" value={form.motivo_id} onChange={handleChange} className={claseCampo('motivo_id')}>
                                        <option value="">Seleccione</option>
                                        {motivos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                    {errors.motivo_id && <p className="mt-1 text-xs text-red-600">{errors.motivo_id}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="responsable_nuevo_id" className="mb-1 block text-sm font-medium text-blue-900/70">Nuevo responsable</label>
                                <select
                                    id="responsable_nuevo_id"
                                    name="responsable_nuevo_id"
                                    value={form.responsable_nuevo_id}
                                    onChange={handleChange}
                                    disabled={!form.area_destino_id}
                                    className={`${claseCampo('responsable_nuevo_id')} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                                >
                                    <option value="">
                                        {form.area_destino_id ? 'A definir por Gestión de Bienes' : 'Seleccione primero el destino'}
                                    </option>
                                    {responsablesDestino.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {errors.responsable_nuevo_id ? (
                                    <p className="mt-1 text-xs text-red-600">{errors.responsable_nuevo_id}</p>
                                ) : form.area_destino_id && responsablesDestino.length === 0 ? (
                                    <p className="mt-1 text-xs text-amber-700">
                                        {areaDestino?.nombre} no tiene usuarios registrados en el sistema.
                                        El movimiento se informa igual y Gestión de Bienes define el responsable.
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Personal de {areaDestino?.nombre || 'el área de destino'}. Es quien deberá firmar
                                        la nueva ficha de inventario; si aún no está definido, mantenga la opción por defecto.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-blue-900/70">Fotografía del bien (opcional)</label>

                                {!imagenPreview ? (
                                    <label
                                        htmlFor="imagen"
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
                                            errors.imagen
                                                ? 'border-red-300 bg-red-50/40'
                                                : 'border-gray-300 bg-gray-50/60 hover:border-institucional-primario/40 hover:bg-blue-50/30'
                                        }`}
                                    >
                                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            <span className="font-medium text-institucional-primario">Adjuntar fotografía</span> del bien o de su etiqueta de inventario
                                        </span>
                                        <span className="text-xs text-gray-400">JPG, PNG o WEBP · Máx. 5 MB</span>
                                        <input
                                            id="imagen"
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImagenChange}
                                            className="sr-only"
                                        />
                                    </label>
                                ) : (
                                    <div className="relative inline-block">
                                        <img src={imagenPreview} alt="Vista previa de la imagen del bien" className="h-40 w-auto rounded-lg border border-gray-200 object-cover" />
                                        <button
                                            type="button"
                                            onClick={quitarImagen}
                                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-600"
                                            aria-label="Quitar imagen"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                {errors.imagen && <p className="mt-1 text-xs text-red-600">{errors.imagen}</p>}
                            </div>

                            <div>
                                <label htmlFor="observaciones_salida" className="mb-1 block text-sm font-medium text-blue-900/70">Observaciones</label>
                                <textarea id="observaciones_salida" name="observaciones_salida" rows={3} value={form.observaciones_salida} onChange={handleChange} className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm" />
                            </div>

                            <div className="flex items-center space-x-4 pt-4">
                                <Link href="/inicio" className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">Cancelar</Link>
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="rounded-lg bg-institucional-primario px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {enviando ? 'Creando...' : 'Crear ticket'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-8">
                        <h3 className="text-sm font-bold text-institucional-primario uppercase tracking-wider mb-4 border-b pb-2">Resumen del movimiento</h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Bien</p>
                                <p className={bienSeleccionado ? 'font-medium text-gray-900' : 'italic text-gray-400'}>
                                    {bienSeleccionado ? `${bienSeleccionado.codigo} - ${bienSeleccionado.nombre}` : 'Sin seleccionar'}
                                </p>
                                {bienSeleccionado && (
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Diaguita: {bienSeleccionado.numero_diaguita || 'sin cargar'}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500">Origen</p>
                                    <p className={`truncate ${areaOrigen ? 'font-medium text-gray-900' : 'italic text-gray-400'}`}>{areaOrigen?.nombre || 'Pendiente'}</p>
                                </div>
                                <span className="shrink-0 text-institucional-secundario">→</span>
                                <div className="min-w-0 flex-1 text-right">
                                    <p className="text-xs text-gray-500">Destino</p>
                                    <p className={`truncate ${areaDestino ? 'font-medium text-gray-900' : 'italic text-gray-400'}`}>{areaDestino?.nombre || 'Sin seleccionar'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-institucional-secundario/30 bg-institucional-secundario/5 p-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500">Responsable actual</p>
                                    <p className={`truncate ${responsableActual ? 'font-medium text-gray-900' : 'italic text-gray-400'}`}>{responsableActual?.name || 'Sin asignar'}</p>
                                </div>
                                <span className="shrink-0 text-institucional-secundario">→</span>
                                <div className="min-w-0 flex-1 text-right">
                                    <p className="text-xs text-gray-500">Nuevo responsable</p>
                                    <p className={`truncate ${responsableNuevo ? 'font-medium text-gray-900' : 'italic text-amber-700'}`}>
                                        {responsableNuevo?.name || 'A definir'}
                                    </p>
                                </div>
                            </div>

                            {!responsableNuevo && (
                                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                    El bien quedará registrado en {areaDestino?.nombre || 'el área de destino'} sin una persona a cargo.
                                    Gestión de Bienes definirá el responsable antes de emitir la ficha de firmas.
                                </p>
                            )}

                            <div>
                                <p className="text-gray-500">Tipo de movimiento</p>
                                <p className={tipoSeleccionado ? 'font-medium text-gray-900' : 'italic text-gray-400'}>{tipoSeleccionado?.nombre || 'Sin seleccionar'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Motivo</p>
                                <p className={motivoSeleccionado ? 'font-medium text-gray-900' : 'italic text-gray-400'}>{motivoSeleccionado?.nombre || 'Sin seleccionar'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Informado por</p>
                                <p className="font-medium text-gray-900">{user.name || '—'}</p>
                            </div>

                            {imagenPreview && (
                                <div>
                                    <p className="text-gray-500 mb-1.5">Imagen adjunta</p>
                                    <img src={imagenPreview} alt="Vista previa" className="h-28 w-full rounded-lg border border-gray-200 object-cover" />
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-4">
                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                    Pendiente de cargar en Diaguita
                                </span>
                                <p className="mt-2 text-xs text-gray-500">
                                    El bien queda registrado en su nueva ubicación de inmediato. Gestión de Bienes recibe el aviso
                                    por correo para volcarlo a Diaguita y coordinar la firma de la ficha.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
