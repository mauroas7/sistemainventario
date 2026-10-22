import { usePage } from '@inertiajs/react';
import { Alerta } from 'hu-kit/componentes';

/** Los mensajes de un solo uso que dejó el controlador con `->with('exito', …)`. */
const TIPOS = ['exito', 'error'];

export default function Flash() {
    const { flash } = usePage().props;

    if (! flash) return null;

    return TIPOS.filter((tipo) => flash[tipo]).map((tipo) => (
        <Alerta key={tipo} tipo={tipo} className="mb-4 animate-fade-in">
            {flash[tipo]}
        </Alerta>
    ));
}
