import { Alerta, Boton, Campo, claseControl, descritoPor, Input, PasswordInput, Rotulo, Select } from 'hu-kit/componentes';

const AYUDA_ROL = {
    admin: 'Ve todos los bienes y movimientos del hospital, y administra el sistema.',
    coordinador: 'Ve e informa movimientos de los bienes de su área.',
    usuario: 'Ve e informa movimientos de los bienes de su área.',
};

/** El alta o la edición de una cuenta, en el lugar de la lista. */
export default function FormularioUsuario({ esNuevo, form, onCambiar, roles, areas, errors, errorGeneral, guardando, onGuardar, onCancelar }) {
    const esAdmin = form.rol === 'admin';

    return (
        <form onSubmit={onGuardar} className="mb-6 rounded-xl bg-canvas p-5 dark:bg-white/5">
            <Rotulo como="h3" className="mb-4 block">{esNuevo ? 'Nuevo usuario' : 'Editar usuario'}</Rotulo>

            {errorGeneral && <Alerta tipo="error" className="mb-4">{errorGeneral}</Alerta>}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input nombre="name" etiqueta="Nombre y apellido" requerido valor={form.name} onChange={onCambiar} error={errors.name} />
                <Input nombre="email" etiqueta="Correo institucional" tipo="email" requerido valor={form.email} onChange={onCambiar} error={errors.email} />
                <Select
                    nombre="rol"
                    etiqueta="Rol"
                    requerido
                    opciones={roles}
                    valor={form.rol}
                    onChange={onCambiar}
                    error={errors.rol}
                    ayuda={AYUDA_ROL[form.rol]}
                    vacio={false}
                />
                <Select
                    nombre="area_id"
                    etiqueta="Área"
                    requerido={! esAdmin}
                    opciones={areas.map((a) => [a.id, a.nombre])}
                    valor={form.area_id}
                    onChange={onCambiar}
                    error={errors.area_id}
                    ayuda="Define qué bienes va a ver."
                    disabled={esAdmin}
                    vacio={esAdmin ? 'Ve todas las áreas' : 'Elegí un área'}
                />
                <div className="md:col-span-2">
                    <Campo id="password" etiqueta={esNuevo ? 'Contraseña' : 'Contraseña (vacía para no cambiarla)'} requerido={esNuevo} error={errors.password}>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={onCambiar}
                            autoComplete="new-password"
                            aria-invalid={errors.password ? 'true' : undefined}
                            aria-describedby={descritoPor('password', errors.password)}
                            className={claseControl(!!errors.password)}
                        />
                    </Campo>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Boton disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Boton>
                <Boton tipo="button" variante="fantasma" forma="grupo" onClick={onCancelar}>
                    Cancelar
                </Boton>
            </div>
        </form>
    );
}
