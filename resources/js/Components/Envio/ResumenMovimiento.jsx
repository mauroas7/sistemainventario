import { Alerta, Dato, Estado, Icono, Rotulo, Tarjeta } from 'hu-kit/componentes';

const VALOR = 'font-semibold text-primary dark:text-gray-100';
const FALTA = 'italic text-brandText-muted dark:text-brandText-mutedDark';

function Paso({ desde, hasta, etiquetaDesde, etiquetaHasta, faltaDesde, faltaHasta }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-canvas p-3 dark:bg-white/5">
            <div className="min-w-0 flex-1">
                <Rotulo className="block">{etiquetaDesde}</Rotulo>
                <p className={`truncate ${desde ? VALOR : FALTA}`}>{desde || faltaDesde}</p>
            </div>
            <Icono nombre="arrow_forward" className="shrink-0 text-secondary-dark dark:text-secondary" />
            <div className="min-w-0 flex-1 text-right">
                <Rotulo className="block">{etiquetaHasta}</Rotulo>
                <p className={`truncate ${hasta ? VALOR : FALTA}`}>{hasta || faltaHasta}</p>
            </div>
        </div>
    );
}

/** Lo que va a quedar registrado, al costado del formulario mientras se completa. */
export default function ResumenMovimiento({ bien, areaOrigen, areaDestino, responsableActual, responsableNuevo, tipo, motivo, informante }) {
    return (
        <Tarjeta titulo="Resumen del movimiento" icono="receipt_long" className="h-fit lg:sticky lg:top-24">
            <div className="space-y-4 text-sm">
                <Dato
                    etiqueta="Bien"
                    valor={bien && `${bien.codigo} - ${bien.nombre}`}
                    siFalta="Sin seleccionar"
                    detalle={bien && `Diaguita: ${bien.numero_diaguita || 'sin cargar'}`}
                />

                <Paso
                    etiquetaDesde="Origen"
                    etiquetaHasta="Destino"
                    desde={areaOrigen?.nombre}
                    hasta={areaDestino?.nombre}
                    faltaDesde="Pendiente"
                    faltaHasta="Sin seleccionar"
                />

                <Paso
                    etiquetaDesde="Responsable actual"
                    etiquetaHasta="Nuevo responsable"
                    desde={responsableActual?.name}
                    hasta={responsableNuevo?.name}
                    faltaDesde="Sin asignar"
                    faltaHasta="A definir"
                />

                {areaDestino && ! responsableNuevo && (
                    <Alerta tipo="aviso">
                        El bien quedará registrado en {areaDestino.nombre} sin una persona a cargo.
                        Gestión de Bienes definirá el responsable antes de emitir la ficha de firmas.
                    </Alerta>
                )}

                <Dato etiqueta="Tipo de movimiento" valor={tipo?.nombre} siFalta="Sin seleccionar" />
                <Dato etiqueta="Motivo" valor={motivo?.nombre} siFalta="Sin seleccionar" />
                <Dato etiqueta="Informado por" valor={informante} />

                <div className="border-t border-brandText-soft/70 pt-4 dark:border-gray-800">
                    <Estado tono="aviso">Pendiente de cargar en Diaguita</Estado>
                    <p className="mt-2 text-xs text-brandText-muted dark:text-brandText-mutedDark">
                        El bien queda registrado en su nueva ubicación de inmediato. Gestión de Bienes recibe el aviso
                        por correo para volcarlo a Diaguita y coordinar la firma de la ficha.
                    </p>
                </div>
            </div>
        </Tarjeta>
    );
}
