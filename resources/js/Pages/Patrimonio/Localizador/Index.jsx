import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Buscador, EstadoVacio, Paginador, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import BienLocalizado from '@/Components/Patrimonio/BienLocalizado';

const ESPERA_MS = 300;

export default function Index({ bienes, ultimosMovimientos = {}, busqueda: busquedaDelServidor = '' }) {
    const [busqueda, setBusqueda] = useState(busquedaDelServidor);

    // La búsqueda la hace el servidor: espera a que se deje de tipear y vuelve a la primera página.
    useEffect(() => {
        if (busqueda.trim() === busquedaDelServidor) return undefined;

        const temporizador = setTimeout(() => {
            router.get(route('patrimonio.localizador.index'), busqueda.trim() ? { busqueda: busqueda.trim() } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, ESPERA_MS);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    return (
        <AppLayout
            titulo="Localizador de bienes"
            subtitulo="Buscá por número de inventario interno, número de Diaguita, nombre o descripción."
            ancho="lectura"
        >
            <Tarjeta className="mb-6">
                <Buscador
                    nombre="busqueda"
                    etiqueta="Buscar bien"
                    valor={busqueda}
                    onChange={setBusqueda}
                    placeholder="Ej: MON001, 950003, notebook, impresora…"
                    autoFocus
                />
            </Tarjeta>

            <div className="space-y-4">
                {bienes.data.length === 0 && (
                    <EstadoVacio icono="search_off">
                        {busquedaDelServidor ? `No se encontraron bienes para «${busquedaDelServidor}».` : 'No hay bienes cargados.'}
                    </EstadoVacio>
                )}

                {bienes.data.map((bien) => (
                    <BienLocalizado key={bien.id} bien={bien} ultimo={ultimosMovimientos[bien.id]} />
                ))}
            </div>

            <div className="mt-4 empty:hidden">
                <Paginador paginador={bienes} />
            </div>
        </AppLayout>
    );
}
