/*
 * Qué puede hacer el usuario con un movimiento, para no ofrecer un botón que el
 * servidor después rechaza. El servidor lo vuelve a verificar.
 */
const mismo = (a, b) => a != null && b != null && String(a) === String(b);

/** El acuse lo da quien quedó a cargo o su área, mientras no esté anulado ni acusado. */
export const puedeAcusar = (m, usuario) =>
    m.estado_movimiento?.nombre !== 'Anulado'
    && ! m.recibido_por
    && (usuario.rol === 'admin' || mismo(m.responsable_nuevo?.id, usuario.id) || mismo(m.area_destino?.id, usuario.area?.id));

/** Anula quien lo informó o Patrimonio, sólo mientras no esté volcado a Diaguita. */
export const puedeAnular = (m, usuario) =>
    m.estado_movimiento?.nombre === 'Informado' && (usuario.rol === 'admin' || mismo(m.creado_por?.id, usuario.id));

/** Cómo se relaciona el usuario con el movimiento. */
export const relacion = (m, usuario) => {
    if (usuario.rol === 'admin') return 'Admin';
    if (mismo(m.area_origen?.id, usuario.area?.id)) return 'Enviado';
    if (mismo(m.area_destino?.id, usuario.area?.id)) return 'A recibir';
    return '—';
};
