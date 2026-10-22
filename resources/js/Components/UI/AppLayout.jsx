import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ApplicationLogo, Icono, ThemeToggle } from 'hu-kit/componentes';
import Flash from '@/Components/UI/Flash';
import MenuDeUsuario from '@/Components/UI/MenuDeUsuario';
import Nav from '@/Components/UI/Nav';

/*
 * `completo` es para las pantallas de datos —listados, agenda, tableros—, que
 * aprovechan todo el ancho. `lectura` es para formularios y documentos: los
 * mantiene en 1152 px para que los renglones no se estiren en pantallas anchas.
 * `formulario` centra en 768 px un formulario de una sola columna de tarjetas.
 */
const ANCHOS = {
    completo: '',
    lectura: 'mx-auto max-w-6xl',
    formulario: 'mx-auto max-w-3xl',
};

/**
 * El marco de todas las pantallas con sesión: barra lateral, encabezado y área
 * de contenido.
 *
 * `titulo` y `subtitulo` son props, y el título además va al `<title>` de la
 * pestaña.
 */
export default function AppLayout({ titulo = 'Inicio', subtitulo = null, ancho = 'completo', children }) {
    const { auth } = usePage().props;
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <div className="flex min-h-screen">
            <Head title={titulo} />

            {/* Barra lateral. En móvil se muestra/oculta con el botón del encabezado. */}
            <aside
                className={`fixed inset-y-0 left-0 z-dropdown flex w-64 flex-col bg-primary transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                    menuAbierto ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-6">
                    <Link href={route('inicio')} className="block min-w-0 flex-1" onClick={cerrarMenu}>
                        <ApplicationLogo variante="blanco" className="h-auto w-full" />
                    </Link>

                    <button
                        type="button"
                        onClick={cerrarMenu}
                        className="text-white/70 hover:text-white lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <Icono nombre="close" className="text-2xl" />
                    </button>
                </div>

                <Nav rol={auth?.usuario?.rol} onNavegar={cerrarMenu} />

                <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-widest text-white/70">Bienes HU</p>
                    <p className="text-xs text-white/70">Gestión de bienes patrimoniales</p>
                </div>
            </aside>

            {/* Fondo oscuro detrás del menú en móvil. */}
            {menuAbierto && (
                <div
                    onClick={cerrarMenu}
                    className="fixed inset-0 z-30 bg-primary-dark/50 lg:hidden"
                    aria-hidden="true"
                />
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-dropdown border-b border-brandText-soft/70 bg-white dark:border-gray-800 dark:bg-surface-dark">
                    <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
                        <button
                            type="button"
                            onClick={() => setMenuAbierto(true)}
                            className="text-primary dark:text-gray-100 lg:hidden"
                            aria-label="Abrir menú"
                            aria-expanded={menuAbierto}
                        >
                            <Icono nombre="menu" className="text-2xl" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="titulo-corto truncate text-base text-primary dark:text-gray-100">
                                {titulo}
                            </h1>
                            {subtitulo && (
                                <p className="truncate text-xs text-brandText-muted dark:text-brandText-mutedDark">{subtitulo}</p>
                            )}
                        </div>

                        {auth?.usuario && (
                            <div className="flex items-center gap-3 sm:gap-5">
                                <ThemeToggle />

                                <div className="hidden h-8 w-px bg-brandText-soft/70 dark:bg-gray-800 sm:block" />

                                <MenuDeUsuario usuario={auth.usuario} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Entra con fade al cambiar de página; una visita a la misma (un filtro) no lo repite. */}
                <main className="flex-1 animate-fade-in px-4 py-6 sm:px-6">
                    <div className={ANCHOS[ancho]}>
                        <Flash />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
