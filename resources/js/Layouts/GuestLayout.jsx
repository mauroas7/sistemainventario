import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            
            {/* Cabecera / Logo Institucional */}
            <div className="text-center">
                <Link href="/">
                    {/* Si tienes un logo, puedes usar una etiqueta <img src="/ruta/logo.png" className="w-24 h-24 mx-auto" alt="Logo Hospital" /> */}
                    <h1 className="text-3xl font-bold text-blue-800">
                        Portal Hospitalario
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">
                        Gestión de Bienes de Uso
                    </p>
                </Link>
            </div>

            {/* Tarjeta del Formulario */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-lg overflow-hidden sm:rounded-xl border-t-4 border-blue-600">
                {children}
            </div>
            
        </div>
    );
}