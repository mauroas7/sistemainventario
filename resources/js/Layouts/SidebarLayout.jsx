import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SidebarLayout({ children, roleSelector }) {
    const { url } = usePage();
    const { auth } = usePage().props; // Obtenemos el usuario logueado desde Inertia
    const rol = auth?.user?.rol;

    const puedeVerPatrimonio =
       rol === 'coordinador' || rol === 'admin';

    const esAdmin = rol === 'admin';
    // Función auxiliar para determinar si un link está activo
    const isActive = (path) => url.startsWith(path);

    // Componente interno para los bloques de la barra lateral
    const SidebarSection = ({ title, path, label }) => {
        const active = isActive(path);
        return (
            <div className="mb-4 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">
                    {title}
                </h4>
                <Link
                    href={path}
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active 
                            ? 'bg-blue-50 text-institucional-primario border border-institucional-primario shadow-inner' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-institucional-primario border border-transparent'
                    }`}
                >
                    {label}
                </Link>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-institucional-fondo font-sans">
            
            {/* 1. Cabecera Superior (Top Bar) */}
            <header className="bg-institucional-primario text-white h-16 flex items-center justify-between px-6 shrink-0 z-10 shadow-md">
                <div>
                    <h1 className="text-xl font-bold tracking-wide">Ticketera de Movimientos de Bienes</h1>
                    <p className="text-xs text-blue-200 opacity-80">Prototipo funcional por roles</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* Placeholder para el selector de roles del prototipo */}
                    {roleSelector && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm opacity-80">Rol (demo)</span>
                            {roleSelector}
                        </div>
                    )}
                    
                    {/* Menú de usuario real y Logout */}
                    <div className="flex items-center border-l border-blue-400 pl-4 ml-4 space-x-4">
                        <span className="text-sm font-medium">
                            {auth?.user?.name || 'Usuario'}
                        </span>
                        
                        {/* Botón de Cerrar Sesión */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-xs bg-blue-800/50 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors border border-blue-700 hover:border-red-500 shadow-sm"
                        >
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </header>

            {/* 2. Contenedor Principal (Sidebar + Contenido) */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Barra Lateral (Sidebar) */}
                <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto shrink-0 p-4">
                    <div className="text-xs font-bold text-institucional-primario mb-4 uppercase tracking-wider px-1">
                        Navegación
                    </div>

                   <nav>
    {/* Todos los roles */}
    <SidebarSection
        title="Inicio"
        path="/inicio"
        label="Inicio"
    />

    <SidebarSection
        title="Envío"
        path="/envio/crear-ticket"
        label="Crear ticket de envío"
    />

    <SidebarSection
        title="Recepción"
        path="/recepcion/bandeja"
        label="Bandeja de recepción"
    />

    {/* Coordinador y administrador */}
    {puedeVerPatrimonio && (
        <>
            <SidebarSection
                title="Control Patrimonial"
                path="/patrimonio/dashboard"
                label="Dashboard patrimonial"
            />

            <SidebarSection
                title="Bienes"
                path="/patrimonio/bienes"
                label="Directorio de bienes"
            />

            <SidebarSection
                title="Auditoría"
                path="/patrimonio/tickets/show"
                label="Auditoría de tickets"
            />
        </>
    )}

    {/* Solamente administrador */}
    {esAdmin && (
        <SidebarSection
            title="Administración"
            path="/patrimonio/configuracion"
            label="Configuración"
        />
    )}
</nav>
                </aside>

                {/* 3. Área de Contenido Principal */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
                
            </div>
        </div>
    );
}