import { useForm } from '@inertiajs/react';
import { Boton, Input, Rotulo, Select, Textarea } from 'hu-kit/componentes';

const VACIO = { codigo: '', numero_diaguita: '', nombre: '', descripcion: '', area_id: '', responsable_id: '', estado_id: '' };

const desdeBien = (bien) => ({
    codigo: bien.codigo,
    numero_diaguita: bien.numero_diaguita ?? '',
    nombre: bien.nombre,
    descripcion: bien.descripcion ?? '',
    area_id: String(bien.area.id),
    responsable_id: bien.responsable ? String(bien.responsable.id) : '',
    estado_id: String(bien.estado.id),
});

/** El alta o la edición de un bien, en el lugar de la lista. `bien` en null es un alta. */
export default function FormularioBien({ bien, areas, estados, responsables, onCerrar }) {
    const esNuevo = bien === null;
    // El área y el responsable de un bien que ya se movió los define su último traslado.
    const conMovimientos = ! esNuevo && bien.movimientos > 0;
    const { data, setData, post, put, processing, errors } = useForm(esNuevo ? VACIO : desdeBien(bien));

    const cambiar = (e) => setData(e.target.name, e.target.value);
    const delArea = responsables.filter((r) => String(r.area_id) === String(data.area_id));

    const guardar = (e) => {
        e.preventDefault();
        const opciones = { preserveScroll: true, onSuccess: onCerrar };

        if (esNuevo) {
            post(route('patrimonio.bienes.store'), opciones);
        } else {
            put(route('patrimonio.bienes.update', { bien: bien.id }), opciones);
        }
    };

    return (
        <form onSubmit={guardar} className="mb-6 rounded-xl bg-canvas p-5 dark:bg-white/5">
            <Rotulo como="h3" className="mb-4 block">{esNuevo ? 'Nuevo bien' : `Editar el bien ${bien.codigo}`}</Rotulo>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input nombre="codigo" etiqueta="N° Inventario" requerido valor={data.codigo} onChange={cambiar} error={errors.codigo} />
                <Input
                    nombre="numero_diaguita"
                    etiqueta="N° Diaguita"
                    valor={data.numero_diaguita}
                    onChange={cambiar}
                    error={errors.numero_diaguita}
                    ayuda="Vacío mientras el bien no esté cargado en Diaguita."
                />
                <div className="md:col-span-2">
                    <Input nombre="nombre" etiqueta="Descripción" requerido valor={data.nombre} onChange={cambiar} error={errors.nombre} />
                </div>
                <div className="md:col-span-2">
                    <Textarea nombre="descripcion" etiqueta="Detalle" valor={data.descripcion} onChange={cambiar} error={errors.descripcion} />
                </div>
                <Select
                    nombre="area_id"
                    etiqueta="Área"
                    requerido
                    opciones={areas.map((a) => [a.id, a.nombre])}
                    valor={data.area_id}
                    onChange={(e) => setData((d) => ({ ...d, area_id: e.target.value, responsable_id: '' }))}
                    error={errors.area_id}
                    disabled={conMovimientos}
                    ayuda={conMovimientos ? 'El bien ya tiene movimientos: cambia de área informando un traslado.' : null}
                    vacio="Elegí un área"
                />
                <Select
                    nombre="responsable_id"
                    etiqueta="Responsable"
                    opciones={delArea.map((r) => [r.id, r.name])}
                    valor={data.responsable_id}
                    onChange={cambiar}
                    error={errors.responsable_id}
                    disabled={conMovimientos || ! data.area_id}
                    ayuda={conMovimientos ? null : 'Vacío, el bien queda sin persona a cargo.'}
                    vacio="Sin asignar"
                />
                <Select
                    nombre="estado_id"
                    etiqueta="Estado"
                    requerido
                    opciones={estados.map((e) => [e.id, e.nombre])}
                    valor={data.estado_id}
                    onChange={cambiar}
                    error={errors.estado_id}
                    vacio="Elegí un estado"
                />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Boton disabled={processing}>{processing ? 'Guardando…' : 'Guardar'}</Boton>
                <Boton tipo="button" variante="fantasma" forma="grupo" onClick={onCerrar}>
                    Cancelar
                </Boton>
            </div>
        </form>
    );
}
