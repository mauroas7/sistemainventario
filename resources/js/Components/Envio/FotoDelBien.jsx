import { useEffect, useState } from 'react';
import { Boton, Campo, SelectorDeArchivo } from 'hu-kit/componentes';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAXIMO = 5 * 1024 * 1024;

/** La foto opcional del bien o de su etiqueta, con vista previa. Valida tipo y peso antes de subirla. */
export default function FotoDelBien({ imagen, onCambiar, error, onError }) {
    const [vistaPrevia, setVistaPrevia] = useState(null);

    useEffect(() => {
        if (! imagen) {
            setVistaPrevia(null);
            return undefined;
        }

        const url = URL.createObjectURL(imagen);
        setVistaPrevia(url);

        return () => URL.revokeObjectURL(url);
    }, [imagen]);

    const elegir = (archivo) => {
        if (! TIPOS.includes(archivo.type)) {
            onError('El archivo debe ser una imagen (JPG, PNG o WEBP).');
            return;
        }

        if (archivo.size > MAXIMO) {
            onError('La imagen no puede pesar más de 5 MB.');
            return;
        }

        onCambiar(archivo);
    };

    return (
        <Campo id="imagen" etiqueta="Fotografía del bien (opcional)" ayuda="Del bien o de su etiqueta de inventario. JPG, PNG o WEBP, hasta 5 MB." error={error}>
            {vistaPrevia ? (
                <div className="flex items-start gap-3">
                    <img
                        src={vistaPrevia}
                        alt="Vista previa de la foto del bien"
                        className="h-40 w-auto rounded-xl border border-brandText-soft/70 object-cover dark:border-gray-800"
                    />
                    <Boton tipo="button" variante="fantasma" forma="grupo" tamano="icono" icono="close" onClick={() => onCambiar(null)} aria-label="Quitar la foto" />
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <SelectorDeArchivo texto="Adjuntar fotografía" nombre="del bien" accept={TIPOS.join(',')} onElegir={elegir} />
                </div>
            )}
        </Campo>
    );
}
