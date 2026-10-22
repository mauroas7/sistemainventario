import { useEffect, useRef, useState } from 'react';
import { Boton, Campo, Icono } from 'hu-kit/componentes';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAXIMO = 5 * 1024 * 1024;

/** La foto opcional del bien o de su etiqueta, con vista previa. Valida tipo y peso antes de subirla. */
export default function FotoDelBien({ imagen, onCambiar, error, onError }) {
    const entrada = useRef(null);
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

    const elegir = (e) => {
        const archivo = e.target.files?.[0] ?? null;

        if (archivo && ! TIPOS.includes(archivo.type)) {
            onError('El archivo debe ser una imagen (JPG, PNG o WEBP).');
            e.target.value = '';
            return;
        }

        if (archivo && archivo.size > MAXIMO) {
            onError('La imagen no puede pesar más de 5 MB.');
            e.target.value = '';
            return;
        }

        onCambiar(archivo);
    };

    const quitar = () => {
        onCambiar(null);
        if (entrada.current) entrada.current.value = '';
    };

    return (
        <Campo id="imagen" etiqueta="Fotografía del bien (opcional)" error={error}>
            {vistaPrevia ? (
                <div className="flex items-start gap-3">
                    <img
                        src={vistaPrevia}
                        alt="Vista previa de la foto del bien"
                        className="h-40 w-auto rounded-xl border border-brandText-soft/70 object-cover dark:border-gray-800"
                    />
                    <Boton tipo="button" variante="fantasma" forma="grupo" tamano="icono" icono="close" onClick={quitar} aria-label="Quitar la foto" />
                </div>
            ) : (
                <label
                    htmlFor="imagen"
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                        error
                            ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20'
                            : 'border-brandText-soft bg-canvas hover:border-secondary dark:border-gray-800 dark:bg-white/5'
                    }`}
                >
                    <Icono nombre="add_a_photo" className="text-3xl text-brandText-muted dark:text-brandText-mutedDark" />
                    <span className="text-sm text-brandText dark:text-brandText-dark">
                        <span className="font-semibold text-primary dark:text-gray-100">Adjuntar fotografía</span> del bien o de su etiqueta de inventario
                    </span>
                    <span className="text-xs text-brandText-muted dark:text-brandText-mutedDark">JPG, PNG o WEBP · Máx. 5 MB</span>
                    <input id="imagen" ref={entrada} type="file" accept={TIPOS.join(',')} onChange={elegir} className="sr-only" />
                </label>
            )}
        </Campo>
    );
}
