import { Boton, cuerpoTabla, encabezadoTabla, Estado, EstadoVacio, renglonTabla } from 'hu-kit/componentes';

const TONO_ROL = { admin: 'info', coordinador: 'aviso', usuario: 'neutro' };

/** Las cuentas de acceso, con editar y dar de baja o reactivar. Nadie se da de baja a sí mismo. */
export default function TablaUsuarios({ usuarios, usuarioActualId, onEditar, onCambiarEstado }) {
    return (
        <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
                <thead>
                    <tr className={encabezadoTabla}>
                        <th className="px-5 pb-2 font-semibold">Usuario</th>
                        <th className="px-3 pb-2 font-semibold">Área</th>
                        <th className="px-3 pb-2 font-semibold">Rol</th>
                        <th className="px-3 pb-2 font-semibold">Estado</th>
                        <th className="w-px px-5 pb-2 font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className={cuerpoTabla}>
                    {usuarios.length > 0 ? (
                        usuarios.map((u) => {
                            const esUsuarioActual = String(u.id) === String(usuarioActualId);

                            return (
                                <tr key={u.id} className={renglonTabla}>
                                    <td className="px-5 py-3">
                                        <p className={`font-semibold ${u.activo ? 'text-primary dark:text-gray-100' : 'text-brandText-muted dark:text-brandText-mutedDark'}`}>
                                            {u.name}
                                            {esUsuarioActual && <span className="ml-1.5 text-xs font-normal text-brandText-muted dark:text-brandText-mutedDark">(vos)</span>}
                                        </p>
                                        <p className="text-xs text-brandText-muted dark:text-brandText-mutedDark">{u.email}</p>
                                    </td>
                                    <td className="px-3 py-3">
                                        {u.area?.nombre ?? (u.rol === 'admin' ? (
                                            <span className="text-xs italic text-brandText-muted dark:text-brandText-mutedDark">Todas</span>
                                        ) : (
                                            <Estado tono="aviso" icono="warning">Sin asignar</Estado>
                                        ))}
                                    </td>
                                    <td className="px-3 py-3">
                                        <Estado tono={TONO_ROL[u.rol] ?? 'neutro'}>{u.rolEtiqueta ?? 'Sin rol'}</Estado>
                                    </td>
                                    <td className="px-3 py-3">
                                        <Estado tono={u.activo ? 'exito' : 'neutro'}>{u.activo ? 'Activo' : 'Desactivado'}</Estado>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Boton tipo="button" variante="fantasma" forma="grupo" icono="edit" onClick={() => onEditar(u)}>
                                                Editar
                                            </Boton>
                                            {! esUsuarioActual && (
                                                <Boton
                                                    tipo="button"
                                                    variante={u.activo ? 'peligro' : 'contorno'}
                                                    forma="grupo"
                                                    icono={u.activo ? 'block' : 'restore'}
                                                    onClick={() => onCambiarEstado(u)}
                                                >
                                                    {u.activo ? 'Desactivar' : 'Reactivar'}
                                                </Boton>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5}>
                                <EstadoVacio enTarjeta icono="group">Sin usuarios cargados.</EstadoVacio>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
