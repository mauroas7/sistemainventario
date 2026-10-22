import { Link, useForm } from '@inertiajs/react';
import { Alerta, Boton, Input } from 'hu-kit/componentes';
import PanelDeIngreso from '@/Components/UI/PanelDeIngreso';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const enviar = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <PanelDeIngreso
            tituloPestana="Recuperar la contraseña"
            titulo="Recuperar la contraseña"
            subtitulo="Te mandamos por correo un enlace para elegir una nueva."
        >
            {status && <Alerta tipo="exito" className="mb-6">{status}</Alerta>}

            <form onSubmit={enviar}>
                <div className="mb-8">
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
                </div>

                <Boton tamano="ingreso" disabled={processing} className="w-full">
                    {processing ? 'Enviando…' : 'Enviar el enlace'}
                </Boton>

                <p className="mt-6 text-center text-sm">
                    <Link href={route('login')} className="font-semibold text-secondary-dark hover:underline dark:text-secondary">
                        Volver a iniciar sesión
                    </Link>
                </p>
            </form>
        </PanelDeIngreso>
    );
}
