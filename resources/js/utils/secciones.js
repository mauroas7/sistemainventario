import { SECCIONES } from '@/data/navegacion';

/** Las secciones que ve un rol, en el orden del menú. */
export function seccionesDelRol(rol) {
    return SECCIONES.filter((seccion) => seccion.roles.length === 0 || seccion.roles.includes(rol));
}
