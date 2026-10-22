import { Rotulo } from 'hu-kit/componentes';

/** Un dato de una ficha: el rótulo arriba y el valor; sin valor, `siFalta` atenuado. */
export default function Dato({ etiqueta, valor, siFalta = '—', detalle = null, className = '' }) {
    const vacio = valor === null || valor === undefined || valor === '';

    return (
        <div className={className}>
            <Rotulo className="block">{etiqueta}</Rotulo>
            <div className={vacio ? 'italic text-brandText-muted dark:text-brandText-mutedDark' : 'font-semibold text-primary dark:text-gray-100'}>
                {vacio ? siFalta : valor}
            </div>
            {detalle && <p className="mt-0.5 text-xs text-brandText-muted dark:text-brandText-mutedDark">{detalle}</p>}
        </div>
    );
}
