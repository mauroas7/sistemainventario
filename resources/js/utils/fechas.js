import { aFecha } from 'hu-kit/componentes';

const LOCALE = 'es-AR';

/** 21/10/2026 21:47 — el backend manda ISO 8601 con huso. */
export const fechaYHora = (valor) => {
    const fecha = aFecha(valor);

    if (! fecha) return '—';

    const dia = fecha.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = fecha.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${dia} ${hora}`;
};
