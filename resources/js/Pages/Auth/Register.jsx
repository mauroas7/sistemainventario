import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Head title="Solicitar Acceso" />

            {/* Panel Izquierdo: Institucional */}
            <div className="hidden lg:flex lg:w-1/2 bg-institucional-primario items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 text-white text-center px-12">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Alta de Personal</h1>
                    <p className="text-blue-100 text-lg font-medium">Gestión Patrimonial</p>
                    <p className="text-blue-200/80 text-sm mt-8 max-w-md mx-auto">
                        Complete sus datos para registrarse. Las cuentas nuevas requieren aprobación de la Administración de Patrimonio antes de poder operar.
                    </p>
                </div>
            </div>

            {/* Panel Derecho: Formulario de Registro */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 h-screen overflow-y-auto">
                <div className="w-full max-w-md mx-auto">
                    
                    <div className="mb-8 text-center lg:text-left pt-8 lg:pt-0">
                        <h2 className="text-3xl font-bold text-gray-900">Crear cuenta</h2>
                        <p className="text-sm text-gray-500 mt-2">Ingrese sus datos profesionales.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5 pb-8">
                        {/* Nombre */}
                        <div>
                            <InputLabel htmlFor="name" value="Nombre Completo y Apellido" className="text-gray-700 font-medium" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Correo */}
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico Institucional" className="text-gray-700 font-medium" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-medium" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-gray-700 font-medium" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-institucional-primario focus:ring-institucional-primario sm:text-sm px-4 py-2.5"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-institucional-primario hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-institucional-primario transition-colors disabled:opacity-50"
                            >
                                Registrarse
                            </button>
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                ¿Ya tiene una cuenta aprobada?{' '}
                                <Link href={route('login')} className="font-medium text-institucional-primario hover:text-blue-800 transition-colors">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}