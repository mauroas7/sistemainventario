import { useForm, usePage } from '@inertiajs/react';
import { Boton, Campo, claseControl, descritoPor, Input, PasswordInput, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';

/** Los datos y la clave de la propia cuenta. */
export default function Cuenta() {
    const usuario = usePage().props.auth.usuario;

    const datos = useForm({ name: usuario.nombre, email: usuario.email });
    const clave = useForm({ current_password: '', password: '', password_confirmation: '' });

    const guardarDatos = (e) => {
        e.preventDefault();
        datos.patch(route('cuenta.actualizar'), { preserveScroll: true });
    };

    const guardarClave = (e) => {
        e.preventDefault();
        clave.put(route('cuenta.clave'), {
            preserveScroll: true,
            onSuccess: () => clave.reset(),
            onError: () => clave.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const campoClave = (id, etiqueta, autoComplete) => (
        <Campo id={id} etiqueta={etiqueta} error={clave.errors[id]}>
            <PasswordInput
                id={id}
                value={clave.data[id]}
                onChange={(e) => clave.setData(id, e.target.value)}
                autoComplete={autoComplete}
                aria-invalid={clave.errors[id] ? 'true' : undefined}
                aria-describedby={descritoPor(id, clave.errors[id])}
                className={claseControl(!!clave.errors[id])}
            />
        </Campo>
    );

    return (
        <AppLayout titulo="Mi cuenta" subtitulo={usuario.rolEtiqueta} ancho="formulario">
            <div className="space-y-6">
                <Tarjeta titulo="Mis datos" icono="person">
                    <form onSubmit={guardarDatos} className="space-y-4">
                        <Input
                            nombre="name"
                            etiqueta="Nombre y apellido"
                            valor={datos.data.name}
                            onChange={(e) => datos.setData('name', e.target.value)}
                            error={datos.errors.name}
                            requerido
                            autoComplete="name"
                        />
                        <Input
                            nombre="email"
                            etiqueta="Correo institucional"
                            tipo="email"
                            valor={datos.data.email}
                            onChange={(e) => datos.setData('email', e.target.value)}
                            error={datos.errors.email}
                            requerido
                            autoComplete="username"
                        />

                        <div className="flex items-center gap-4">
                            <Boton disabled={datos.processing}>Guardar</Boton>
                            {datos.recentlySuccessful && (
                                <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">Guardado.</p>
                            )}
                        </div>
                    </form>
                </Tarjeta>

                <Tarjeta titulo="Contraseña" icono="lock">
                    <form onSubmit={guardarClave} className="space-y-4">
                        {campoClave('current_password', 'Contraseña actual', 'current-password')}
                        {campoClave('password', 'Contraseña nueva', 'new-password')}
                        {campoClave('password_confirmation', 'Repetí la contraseña nueva', 'new-password')}

                        <div className="flex items-center gap-4">
                            <Boton disabled={clave.processing}>Cambiar la contraseña</Boton>
                            {clave.recentlySuccessful && (
                                <p className="text-sm text-brandText-muted dark:text-brandText-mutedDark">Guardada.</p>
                            )}
                        </div>
                    </form>
                </Tarjeta>
            </div>
        </AppLayout>
    );
}
