import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children, userRole = 'usuario' }) {
    // usePage() nos permite saber en qué URL estamos para marcar el botón activo
    const { url } = usePage();

    return (
        <>
            <div id="toastContainer" className="toast-container"></div>
            
            <header className="topbar">
                <div>
                    <h1>Ticketera de Movimientos de Bienes</h1>
                    <span className="muted">Gestión de Patrimonio</span>
                </div>
                <div className="topbar-actions">
                    <label>Rol (Mock):</label>
                    <select className="text-black" defaultValue={userRole}>
                        <option value="usuario">Coordinador (Usuario)</option>
                        <option value="admin">Patrimonio (Silvana)</option>
                    </select>
                </div>
            </header>

            <div className="layout">
                <aside className="sidebar">
                    <h3>Navegación</h3>
                    <div className="nav-group">
                        <h4>Inicio</h4>
                        <Link href="/mis-bienes" className={`nav-btn block no-underline ${url.startsWith('/mis-bienes') ? 'active' : ''}`}>
                            Mis Bienes a Cargo
                        </Link>
                    </div>
                    <div className="nav-group">
                        <h4>Envío</h4>
                        <Link href="/nuevo" className={`nav-btn block no-underline ${url === '/nuevo' ? 'active' : ''}`}>
                            Crear ticket de traslado
                        </Link>
                    </div>
                    <div className="nav-group">
                        <h4>Recepción</h4>
                        <Link href="/recepcion" className={`nav-btn block no-underline ${url === '/recepcion' ? 'active' : ''}`}>
                            Bandeja de recepción
                        </Link>
                    </div>
                    {/* Renderizado condicional según el rol */}
                    {userRole === 'admin' && (
                        <div className="nav-group">
                            <h4>Control patrimonial</h4>
                            <Link href="/dashboard" className={`nav-btn block no-underline ${url === '/dashboard' ? 'active' : ''}`}>
                                Dashboard patrimonial
                            </Link>
                        </div>
                    )}
                </aside>

                <main className="content">
                    {/* Aquí se inyectará el contenido de cada vista */}
                    {children}
                </main>
            </div>
        </>
    );
}