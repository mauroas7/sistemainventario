import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

const ESPERA_MS = 300;

/** El texto de un buscador que filtra en el servidor: consulta cuando se deja de tipear, desde la primera página. */
export function useBusquedaEnServidor(ruta, busquedaDelServidor = '') {
    const [busqueda, setBusqueda] = useState(busquedaDelServidor);

    useEffect(() => {
        if (busqueda.trim() === busquedaDelServidor) return undefined;

        const temporizador = setTimeout(() => {
            router.get(route(ruta), busqueda.trim() ? { busqueda: busqueda.trim() } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, ESPERA_MS);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    return [busqueda, setBusqueda];
}
