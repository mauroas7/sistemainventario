import { usePage } from '@inertiajs/react';
import { MarcoApp, rutaActiva } from 'hu-kit/componentes';
import { seccionesDelRol } from '@/utils/secciones';

const SISTEMA = { nombre: 'Bienes HU', bajada: 'Gestión de bienes patrimoniales' };

/**
 * El marco de todas las pantallas con sesión: el `MarcoApp` de hu-kit con lo
 * propio de este sistema, el menú del rol, el área bajo el nombre y «Mi
 * cuenta». Las páginas pasan sólo `titulo`, `subtitulo` y `ancho`.
 */
export default function AppLayout({ titulo = 'Inicio', subtitulo = null, ancho = 'completo', children }) {
    const { usuario } = usePage().props.auth;

    const secciones = seccionesDelRol(usuario?.rol).map((seccion) => ({
        ...seccion,
        href: route(seccion.ruta),
        activa: rutaActiva(seccion.activaEn ?? seccion.ruta),
    }));

    return (
        <MarcoApp
            titulo={titulo}
            subtitulo={subtitulo}
            ancho={ancho}
            secciones={secciones}
            inicio={route('inicio')}
            sistema={SISTEMA}
            usuario={usuario && { nombre: usuario.nombre, email: usuario.email, rol: usuario.rolEtiqueta, detalle: usuario.area?.nombre }}
            enlaces={[{ etiqueta: 'Mi cuenta', icono: 'manage_accounts', href: route('cuenta') }]}
            salir={route('logout')}
        >
            {children}
        </MarcoApp>
    );
}
