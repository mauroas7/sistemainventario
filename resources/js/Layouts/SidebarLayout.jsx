import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    PaperAirplaneIcon,
    InboxArrowDownIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    ArchiveBoxIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid';

export default function SidebarLayout({ children, roleSelector }) {
    const { url } = usePage();
    const { auth } = usePage().props; // Obtenemos el usuario logueado desde Inertia
    const role = auth?.user?.rol;
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Función auxiliar para determinar si un link está activo
    const isActive = (path) => url.startsWith(path);

    const iniciales = (auth?.user?.name || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0]?.toUpperCase())
        .join('');

    // Bloque de la barra lateral: un título y uno o más links con ícono.
    const SidebarGroup = ({ title, links }) => (
        <div className="mb-4 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">
                {title}
            </h4>
            <div className="space-y-1">
                {links.map(({ path, label, icon: Icon }) => {
                    const active = isActive(path);
                    return (
                        <Link
                            key={path}
                            href={path}
                            onClick={() => setMenuAbierto(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg border-l-4 transition-colors ${
                                active
                                    ? 'bg-blue-50 text-institucional-primario border-l-institucional-secundario shadow-inner'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-institucional-primario border-l-transparent'
                            }`}
                        >
                            {Icon && <Icon className="h-4 w-4 shrink-0" />}
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    const navegacion = (
        <nav>
            <SidebarGroup title="Inicio" links={[{ path: '/inicio', label: 'Inicio', icon: HomeIcon }]} />
            <SidebarGroup title="Envío" links={[{ path: '/envio/crear-ticket', label: 'Crear ticket de envío', icon: PaperAirplaneIcon }]} />
            <SidebarGroup title="Recepción" links={[{ path: '/recepcion/bandeja', label: 'Bandeja de recepción', icon: InboxArrowDownIcon }]} />

            {role === 'admin' && (
                <SidebarGroup
                    title="Control Patrimonial"
                    links={[
                        { path: '/patrimonio/dashboard', label: 'Dashboard patrimonial', icon: ChartBarIcon },
                        { path: '/patrimonio/localizador', label: 'Localizador de bienes', icon: MagnifyingGlassIcon },
                        { path: '/patrimonio/bienes', label: 'Directorio de bienes', icon: ArchiveBoxIcon },
                        { path: '/patrimonio/configuracion', label: 'Configuración', icon: Cog6ToothIcon },
                    ]}
                />
            )}
        </nav>
    );

    return (
        <div className="flex flex-col h-screen bg-institucional-fondo font-sans">

            {/* 1. Cabecera Superior (Top Bar) */}
            <header className="bg-institucional-primario text-white h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={() => setMenuAbierto((v) => !v)}
                        className="md:hidden shrink-0 rounded-md p-1.5 text-blue-100 hover:bg-white/10 hover:text-white"
                        aria-label="Abrir menú de navegación"
                    >
                        {menuAbierto ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>

                    <img
                        src="/img/Logo HU Blanco.png"
                        alt="Hospital Universitario"
                        className="hidden sm:block h-9 w-auto shrink-0"
                    />

                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-bold tracking-wide truncate">Ticketera de Movimientos de Bienes</h1>
                        <p className="hidden sm:block text-xs text-blue-200 opacity-80">Sistema de Gestión Patrimonial</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Placeholder para el selector de roles del prototipo */}
                    {roleSelector && (
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="text-sm opacity-80">Rol (demo)</span>
                            {roleSelector}
                        </div>
                    )}

                    {/* Menú de usuario real y Logout */}
                    <div className="flex items-center border-l border-blue-400 pl-3 sm:pl-4 ml-1 sm:ml-2 space-x-3">
                        <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-institucional-secundario text-sm font-bold text-institucional-primario">
                            {iniciales || 'U'}
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium leading-4">
                                {auth?.user?.name || 'Usuario'}
                            </div>
                            <div className="text-xs text-blue-200 opacity-90">
                                {auth?.user?.area?.nombre || 'Sin área'}
                            </div>
                        </div>

                        {/* Botón de Cerrar Sesión */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 text-xs bg-blue-800/50 hover:bg-red-600 text-white px-2.5 sm:px-3 py-1.5 rounded-md transition-colors border border-blue-700 hover:border-red-500 shadow-sm"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* 2. Contenedor Principal (Sidebar + Contenido) */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Fondo oscuro al abrir el menú en mobile */}
                {menuAbierto && (
                    <div
                        className="fixed inset-0 z-10 bg-gray-900/40 md:hidden"
                        onClick={() => setMenuAbierto(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Barra Lateral (Sidebar) */}
                <aside
                    className={`fixed inset-y-0 left-0 top-16 z-20 w-64 bg-white border-r border-gray-200 overflow-y-auto shrink-0 p-4
                        transform transition-transform duration-200 ease-in-out
                        md:static md:top-0 md:translate-x-0
                        ${menuAbierto ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
                >
                    <div className="text-xs font-bold text-institucional-primario mb-4 uppercase tracking-wider px-1">
                        Navegación
                    </div>

                    {navegacion}
                </aside>

                {/* 3. Área de Contenido Principal */}
                <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
