/**
 * El mapa del menú lateral. `roles` son slugs de `App\Enums\Rol`; vacío, lo ven
 * todos. `activaEn` acepta un prefijo terminado en `.` y `titulo` abre un grupo.
 */
export const SECCIONES = [
    { etiqueta: 'Inicio', icono: 'home', ruta: 'inicio', roles: [] },
    { etiqueta: 'Mis bienes', icono: 'inventory_2', ruta: 'mis-bienes', roles: ['coordinador', 'usuario'] },
    { titulo: 'Envío', etiqueta: 'Crear ticket de envío', icono: 'send', ruta: 'envio.crear', roles: [] },
    {
        titulo: 'Recepción',
        etiqueta: 'Bandeja de recepción',
        icono: 'move_to_inbox',
        ruta: 'recepcion.bandeja',
        activaEn: ['recepcion.bandeja', 'recepcion.show'],
        roles: [],
    },
    {
        titulo: 'Control patrimonial',
        etiqueta: 'Dashboard patrimonial',
        icono: 'monitoring',
        ruta: 'patrimonio.dashboard',
        activaEn: ['patrimonio.dashboard', 'patrimonio.movimientos.'],
        roles: ['admin'],
    },
    { etiqueta: 'Localizador de bienes', icono: 'travel_explore', ruta: 'patrimonio.localizador.index', roles: ['admin'] },
    { etiqueta: 'Directorio de bienes', icono: 'inventory_2', ruta: 'patrimonio.bienes.index', activaEn: 'patrimonio.bienes.', roles: ['admin'] },
    { etiqueta: 'Configuración', icono: 'settings', ruta: 'patrimonio.configuracion.index', roles: ['admin'] },
];
