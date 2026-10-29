import { Link, useForm } from '@inertiajs/react';
import { Alerta, Boton, Campo, Checkbox, claseControl, descritoPor, Input, PasswordInput } from 'hu-kit/componentes';
import PanelDeIngreso from '@/Components/UI/PanelDeIngreso';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const enviar = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <PanelDeIngreso tituloPestana="Ingresar" titulo="Iniciar sesión" subtitulo="Accedé con tu correo institucional.">
            {status && <Alerta tipo="exito" className="mb-6">{status}</Alerta>}

            <form onSubmit={enviar}>
                <div className="mb-8 space-y-5">
                    {/* `required` y no `requerido`: el ingreso no marca los campos con asterisco. */}
                    <Input
                        nombre="email"
                        variante="ingreso"
                        etiqueta="Correo institucional"
                        tipo="email"
                        valor={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                        autoFocus
                        autoComplete="username"
                    />

                    <Campo id="password" etiqueta="Contraseña" error={errors.password} variante="ingreso">
                        <PasswordInput
                            id="password"
                            variante="ingreso"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="current-password"
                            aria-invalid={errors.password ? 'true' : undefined}
                            aria-describedby={descritoPor('password', errors.password)}
                            className={claseControl(!!errors.password, 'ingreso')}
                        />
                    </Campo>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Checkbox
                            nombre="remember"
                            etiqueta="Mantener la sesión iniciada"
                            valor={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-semibold text-secondary-dark hover:underline dark:text-secondary"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                </div>

                <Boton tamano="ingreso" disabled={processing} className="w-full">
                    {processing ? 'Ingresando…' : 'Ingresar'}
                </Boton>
            </form>
        </PanelDeIngreso>
    );
}
