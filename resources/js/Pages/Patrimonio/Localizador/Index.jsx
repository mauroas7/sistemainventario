import { useMemo, useState } from 'react';
import { EstadoVacio, Input, Tarjeta } from 'hu-kit/componentes';
import AppLayout from '@/Components/UI/AppLayout';
import BienLocalizado from '@/Components/Patrimonio/BienLocalizado';

const normalizar = (texto) => String(texto ?? '').toLowerCase();

export default function Index({ bienes = [], ultimosMovimientos = {} }) {
    const [busqueda, setBusqueda] = useState('');

    const resultados = useMemo(() => {
        const q = normalizar(busqueda.trim());

        return bienes
            .filter((bien) => ! q || [bien.codigo, bien.numero_diaguita, bien.nombre, bien.descripcion].some((campo) => normalizar(campo).includes(q)))
            .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
    }, [bienes, busqueda]);

    return (
        <AppLayout
            titulo="Localizador de bienes"
            subtitulo="Buscá por número de inventario interno, número de Diaguita, nombre o descripción."
            ancho="lectura"
        >
            <Tarjeta className="mb-6">
                <Input
                    nombre="busqueda"
                    etiqueta="Buscar bien"
                    valor={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Ej: MON001, 950003, notebook, impresora…"
                    autoFocus
                />
            </Tarjeta>

            <div className="space-y-4">
                {resultados.length === 0 && <EstadoVacio icono="search_off">No se encontraron bienes para «{busqueda}».</EstadoVacio>}

                {resultados.map((bien) => (
                    <BienLocalizado key={bien.id} bien={bien} ultimo={ultimosMovimientos[bien.id]} />
                ))}
            </div>
        </AppLayout>
    );
}
