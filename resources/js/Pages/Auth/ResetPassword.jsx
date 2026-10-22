import { useForm } from '@inertiajs/react';
import { Boton, Campo, claseControl, descritoPor, Input, PasswordInput } from 'hu-kit/componentes';
import PanelDeIngreso from '@/Components/UI/PanelDeIngreso';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const enviar = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const campoClave = (id, etiqueta) => (
        <Campo id={id} etiqueta={etiqueta} error={errors[id]} variante="ingreso">
            <PasswordInput
                id={id}
                variante="ingreso"
                value={data[id]}
                onChange={(e) => setData(id, e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={errors[id] ? 'true' : undefined}
                aria-describedby={descritoPor(id, errors[id])}
                className={claseControl(!!errors[id], 'ingreso')}
            />
        </Campo>
    );

    return (
        <PanelDeIngreso
            tituloPestana="Nueva contraseña"
            titulo="Nueva contraseña"
            subtitulo="Elegí la contraseña con la que vas a ingresar."
        >
            <form onSubmit={enviar}>
                <div className="mb-8 space-y-5">
                    <Input
                        nombre="email"
                        variante="ingreso"
                        etiqueta="Correo institucional"
                        tipo="email"
                        valor={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                        autoComplete="username"
                    />

                    {campoClave('password', 'Contraseña nueva')}
                    {campoClave('password_confirmation', 'Repetí la contraseña')}
                </div>

                <Boton tamano="ingreso" disabled={processing} className="w-full">
                    {processing ? 'Guardando…' : 'Guardar la contraseña'}
                </Boton>
            </form>
        </PanelDeIngreso>
    );
}
