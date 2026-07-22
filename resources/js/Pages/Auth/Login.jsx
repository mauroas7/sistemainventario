import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Head title="Iniciar Sesión" />

            {/* Panel Izquierdo: Institucional (Oculto en móviles) */}
            <div className="hidden lg:flex lg:w-1/2 bg-institucional-primario items-center justify-center relative overflow-hidden">
                {/* Patrón de fondo sutil para que no quede un color sólido aburrido */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="relative z-10 text-white text-center px-12">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
                        {/* Icono de Hospital/Sistema */}
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Sistema de Gestión de Bienes</h1>
                    <p className="text-blue-100 text-lg font-medium">Portal Hospitalario</p>
                    <p className="text-blue-200/80 text-sm mt-8 max-w-md mx-auto">
                        Acceso restringido para personal autorizado. Toda transacción en este sistema está sujeta a auditoría patrimonial.
                    </p>
                </div>
            </div>

            {/* Panel Derecho: Formulario de Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md">
                    
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900">Bienvenido/a</h2>
                        <p className="text-sm text-gray-500 mt-2">Ingrese sus credenciales institucionales para continuar.</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600 p-3 bg-green-50 rounded-lg border border-green-200">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico Institucional" className="text-gray-700 font-medium" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-medium" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-institucional-primario hover:text-blue-800 transition-colors"
                                    >
                                        ¿Olvidó su contraseña?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block">
                            <label className="flex items-center w-fit cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-institucional-primario focus:ring-institucional-primario border-gray-300 rounded cursor-pointer"
                                />
                                <span className="ms-2 text-sm text-gray-600 select-none">
                                    Mantener sesión iniciada
                                </span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-institucional-primario hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-institucional-primario transition-colors disabled:opacity-50"
                        >
                            Ingresar al sistema
                        </button>
                        
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                ¿No tiene cuenta?{' '}
                                <Link href={route('register')} className="font-medium text-institucional-primario hover:text-blue-800 transition-colors">
                                    Solicitar acceso
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}