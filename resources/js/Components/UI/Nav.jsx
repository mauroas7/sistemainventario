import { Link } from '@inertiajs/react';
import { Icono } from 'hu-kit/componentes';
import { rutaActiva } from '@/utils/rutas';
import { seccionesDelRol } from '@/utils/secciones';

/** El menú lateral. Dibuja las secciones que ve el rol del usuario. */
export default function Nav({ rol, onNavegar = null }) {
    const visibles = seccionesDelRol(rol);

    return (
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Secciones">
            {visibles.map((seccion) => {
                const activa = rutaActiva(seccion.activaEn ?? seccion.ruta);

                return (
                    <div key={seccion.ruta}>
                        {seccion.titulo && (
                            <>
                                <hr className="my-3 border-white/10" aria-hidden="true" />
                                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-white/70">
                                    {seccion.titulo}
                                </p>
                            </>
                        )}

                        <Link
                            href={route(seccion.ruta)}
                            onClick={onNavegar}
                            aria-current={activa ? 'page' : undefined}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                activa
                                    ? 'bg-white/10 font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {/* Relleno para la sección activa, trazo para el resto (Manual de Marca). */}
                            <Icono
                                nombre={seccion.icono}
                                relleno={activa}
                                className="text-xl transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                            <span>{seccion.etiqueta}</span>

                            {activa && (
                                <span className="ml-auto h-5 w-1 rounded-full bg-secondary" aria-hidden="true" />
                            )}
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
}
