/**
 * Helpers de ruta que usan el menú y las pestañas.
 *
 * Ziggy expone `route()` global, pero no dice en qué ruta estás de una forma
 * cómoda para comparar contra un prefijo, que es lo que el menú necesita para
 * marcarse en todas las pantallas de su módulo.
 */

/** El nombre de la ruta actual, o null si Ziggy todavía no está montado. */
export function rutaActual() {
    try {
        return route().current() || null;
    } catch {
        return null;
    }
}

/**
 * ¿La ruta actual cae dentro de alguno de estos patrones?
 *
 * Un patrón terminado en `.` es un prefijo: `admin.usuarios.` cubre
 * `admin.usuarios.index` y `admin.usuarios.editar`. Sin el punto final, la
 * coincidencia es exacta.
 */
export function rutaActiva(patrones) {
    const actual = rutaActual();

    if (! actual) return false;

    return [].concat(patrones).some((patron) =>
        patron.endsWith('.') ? actual.startsWith(patron) : actual === patron,
    );
}
