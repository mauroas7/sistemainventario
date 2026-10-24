import { Flash, PanelAutenticacion } from 'hu-kit/componentes';

/** El panel de `hu-kit` con el nombre de este sistema, para las tres pantallas de ingreso. */
export default function PanelDeIngreso({ tituloPestana, titulo, subtitulo, children }) {
    return (
        <PanelAutenticacion
            tituloPestana={tituloPestana}
            nombre={
                <>
                    Bienes
                    <br />
                    HU
                </>
            }
            bajada="Consulta de los bienes patrimoniales de cada área y aviso formal de sus traslados."
            rotulo="Hospital Universitario"
            titulo={titulo}
            subtitulo={subtitulo}
        >
            <Flash />
            {children}
        </PanelAutenticacion>
    );
}
