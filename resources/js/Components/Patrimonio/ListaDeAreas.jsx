import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Boton, EstadoVacio, Input, Tarjeta } from 'hu-kit/componentes';

/** Las áreas del hospital, con su alta y el cambio de nombre en el lugar de la lista. */
export default function ListaDeAreas({ areas }) {
    const [editando, setEditando] = useState(null); // null | 'nueva' | id
    const { data, setData, post, put, processing, errors, clearErrors } = useForm({ nombre: '' });

    const abrir = (id, nombre = '') => {
        setEditando(id);
        setData('nombre', nombre);
        clearErrors();
    };

    const guardar = (e) => {
        e.preventDefault();
        const opciones = { preserveScroll: true, onSuccess: () => setEditando(null) };

        if (editando === 'nueva') {
            post(route('patrimonio.areas.store'), opciones);
        } else {
            put(route('patrimonio.areas.update', { area: editando }), opciones);
        }
    };

    const formulario = (
        <form onSubmit={guardar} className="space-y-3 rounded-xl bg-canvas p-4 dark:bg-white/5">
            <Input
                nombre="nombre"
                etiqueta={editando === 'nueva' ? 'Nueva área' : 'Nombre del área'}
                requerido
                valor={data.nombre}
                onChange={(e) => setData('nombre', e.target.value)}
                error={errors.nombre}
            />
            <div className="flex flex-wrap items-center gap-3">
                <Boton disabled={processing}>{processing ? 'Guardando…' : 'Guardar'}</Boton>
                <Boton tipo="button" variante="fantasma" forma="grupo" onClick={() => setEditando(null)}>
                    Cancelar
                </Boton>
            </div>
        </form>
    );

    return (
        <Tarjeta
            titulo="Áreas"
            icono="domain"
            contador={areas.length}
            className="h-fit"
            acciones={editando === null && (
                <Boton icono="add" forma="grupo" tipo="button" onClick={() => abrir('nueva')}>
                    Nueva área
                </Boton>
            )}
        >
            {editando === 'nueva' && <div className="mb-4">{formulario}</div>}

            {areas.length > 0 ? (
                <ul className="space-y-1 text-sm text-brandText dark:text-brandText-dark">
                    {areas.map((a) => (
                        <li key={a.id}>
                            {editando === a.id ? (
                                formulario
                            ) : (
                                <div className="flex items-center justify-between gap-2">
                                    <span>{a.nombre}</span>
                                    <Boton
                                        tipo="button"
                                        variante="fantasma"
                                        forma="grupo"
                                        tamano="icono"
                                        icono="edit"
                                        aria-label={`Cambiar el nombre de ${a.nombre}`}
                                        onClick={() => abrir(a.id, a.nombre)}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <EstadoVacio enTarjeta icono="domain">Sin áreas cargadas.</EstadoVacio>
            )}
        </Tarjeta>
    );
}
