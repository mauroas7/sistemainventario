import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Alerta, Boton, ModalConfirmar, Tarjeta, useConfirmacion } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import FormularioUsuario from '@/Components/Patrimonio/FormularioUsuario';
import ListaDeAreas from '@/Components/Patrimonio/ListaDeAreas';
import TablaUsuarios from '@/Components/Patrimonio/TablaUsuarios';

const FORM_VACIO = { name: '', email: '', password: '', rol: 'coordinador', area_id: '' };

export default function Index({ areas = [], roles = [], usuarios = [] }) {
    const usuarioActualId = usePage().props.auth.usuario.id;
    const { confirmar, props: modal } = useConfirmacion();

    const [editando, setEditando] = useState(null); // null | 'nuevo' | id
    const [form, setForm] = useState(FORM_VACIO);
    const [errors, setErrors] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [errorEstado, setErrorEstado] = useState('');

    // Una cuenta sin área no ve ningún bien: hay que poder detectarlas de un vistazo.
    const sinArea = usuarios.filter((u) => u.rol !== 'admin' && ! u.area_id);
    const activos = usuarios.filter((u) => u.activo).length;

    const abrir = (id, datos) => {
        setEditando(id);
        setForm(datos);
        setErrors({});
        setErrorGeneral('');
    };

    const abrirEdicion = (usuario) =>
        abrir(usuario.id, {
            name: usuario.name,
            email: usuario.email,
            password: '',
            rol: usuario.rol || 'usuario',
            area_id: usuario.area_id ? String(usuario.area_id) : '',
        });

    const cerrar = () => abrir(null, FORM_VACIO);

    const cambiar = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors(({ [name]: _quitado, ...resto }) => resto);
    };

    const guardar = (e) => {
        e.preventDefault();
        setGuardando(true);

        const esNuevo = editando === 'nuevo';
        const datos = { ...form };

        // Al editar, la contraseña vacía significa "no cambiarla".
        if (! esNuevo && ! datos.password) delete datos.password;
        // Patrimonio ve todo el hospital: no se le asigna un área operativa.
        if (datos.rol === 'admin') delete datos.area_id;

        const opciones = {
            preserveScroll: true,
            onSuccess: cerrar,
            onError: ({ general, ...campos }) => {
                setErrors(campos);
                setErrorGeneral(general || '');
            },
            onFinish: () => setGuardando(false),
        };

        if (esNuevo) {
            router.post(route('patrimonio.usuarios.store'), datos, opciones);
        } else {
            router.put(route('patrimonio.usuarios.update', { usuario: editando }), datos, opciones);
        }
    };

    const cambiarEstado = (usuario) => {
        setErrorEstado('');
        const accion = (r) =>
            r.put(route('patrimonio.usuarios.update', { usuario: usuario.id }), { activo: ! usuario.activo }, {
                preserveScroll: true,
                onError: (errores) => setErrorEstado(errores.general || Object.values(errores)[0] || 'No se pudo cambiar el estado del usuario.'),
            });

        if (! usuario.activo) {
            accion(router);
            return;
        }

        confirmar({
            titulo: `Desactivar a ${usuario.name}`,
            detalle: 'Va a perder el acceso y dejará de aparecer como posible responsable, pero su historial se conserva.',
            textoAceptar: 'Desactivar',
            accion,
        });
    };

    return (
        <AppLayout titulo="Configuración del sistema" subtitulo="Áreas y cuentas de acceso al portal.">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <ListaDeAreas areas={areas} />

                <Tarjeta
                    titulo={`Usuarios · ${activos} activos de ${usuarios.length}`}
                    icono="group"
                    className="xl:col-span-2"
                    acciones={editando === null && (
                        <Boton icono="add" forma="grupo" tipo="button" onClick={() => abrir('nuevo', FORM_VACIO)}>
                            Nuevo usuario
                        </Boton>
                    )}
                >
                    {sinArea.length > 0 && editando === null && (
                        <Alerta tipo="aviso" className="mb-4">
                            {sinArea.length === 1 ? 'Hay 1 usuario sin área asignada' : `Hay ${sinArea.length} usuarios sin área asignada`}{' '}
                            ({sinArea.map((u) => u.name).join(', ')}). Sin área no ven ningún bien: asignales una editando la cuenta.
                        </Alerta>
                    )}

                    {editando !== null && (
                        <FormularioUsuario
                            esNuevo={editando === 'nuevo'}
                            form={form}
                            onCambiar={cambiar}
                            roles={roles}
                            areas={areas}
                            errors={errors}
                            errorGeneral={errorGeneral}
                            guardando={guardando}
                            onGuardar={guardar}
                            onCancelar={cerrar}
                        />
                    )}

                    {errorEstado && <Alerta tipo="error" className="mb-4">{errorEstado}</Alerta>}

                    <TablaUsuarios usuarios={usuarios} usuarioActualId={usuarioActualId} onEditar={abrirEdicion} onCambiarEstado={cambiarEstado} />
                </Tarjeta>
            </div>

            <ModalConfirmar {...modal} />
        </AppLayout>
    );
}
