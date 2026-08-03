import React, { useEffect, useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import LoadingState from '@/Components/LoadingState';
import {
    BuildingOffice2Icon,
    UsersIcon,
    PlusIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon,
    NoSymbolIcon,
    ArrowPathIcon,
} from '@heroicons/react/20/solid';
import axios from 'axios';

const ROL_CLASES = {
    admin: 'bg-institucional-primario/10 text-institucional-primario border-institucional-primario/20',
    coordinador: 'bg-blue-100 text-blue-800 border-blue-200',
    usuario: 'bg-gray-100 text-gray-700 border-gray-200',
};

const ROLES = [
    { valor: 'admin', etiqueta: 'Administrador (Gestión de Bienes)', ayuda: 'Ve todos los bienes y movimientos del hospital, y administra el sistema.' },
    { valor: 'coordinador', etiqueta: 'Coordinador / Jefe de área', ayuda: 'Ve e informa movimientos de los bienes de su área.' },
    { valor: 'usuario', etiqueta: 'Usuario', ayuda: 'Ve e informa movimientos de los bienes de su área.' },
];

const FORM_VACIO = { name: '', email: '', password: '', rol: 'coordinador', area_id: '' };

export default function Index() {
    const { auth } = usePage().props;
    const usuarioActualId = auth?.user?.id;

    const [areas, setAreas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [editando, setEditando] = useState(null); // null | 'nuevo' | id
    const [form, setForm] = useState(FORM_VACIO);
    const [errors, setErrors] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);

    function cargarUsuarios() {
        return axios.get('/users').then((res) => {
            setUsuarios(res.data.data || res.data || []);
        });
    }

    useEffect(() => {
        Promise.all([
            axios.get('/areas'),
            axios.get('/users'),
        ]).then(([areasRes, usersRes]) => {
            setAreas(areasRes.data.data || areasRes.data || []);
            setUsuarios(usersRes.data.data || usersRes.data || []);
        }).catch(() => {
            setAreas([]);
            setUsuarios([]);
        }).finally(() => setCargando(false));
    }, []);

    // Una cuenta sin área no ve ningún bien: hay que poder detectarlas de un vistazo.
    const sinArea = useMemo(
        () => usuarios.filter(u => u.rol !== 'admin' && !u.area_id),
        [usuarios]
    );

    const activos = useMemo(() => usuarios.filter(u => u.activo !== false).length, [usuarios]);

    function abrirNuevo() {
        setEditando('nuevo');
        setForm(FORM_VACIO);
        setErrors({});
        setErrorGeneral('');
    }

    function abrirEdicion(usuario) {
        setEditando(usuario.id);
        setForm({
            name: usuario.name || '',
            email: usuario.email || '',
            password: '',
            rol: usuario.rol || 'usuario',
            area_id: usuario.area_id ? String(usuario.area_id) : '',
        });
        setErrors({});
        setErrorGeneral('');
    }

    function cerrarFormulario() {
        setEditando(null);
        setForm(FORM_VACIO);
        setErrors({});
        setErrorGeneral('');
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setErrors(prev => {
            if (!prev[name]) return prev;
            const { [name]: _quitado, ...resto } = prev;
            return resto;
        });
    }

    function guardar(e) {
        e.preventDefault();
        setGuardando(true);
        setErrors({});
        setErrorGeneral('');

        const esNuevo = editando === 'nuevo';
        const datos = { ...form };

        // Al editar, contraseña vacía significa "no cambiarla".
        if (!esNuevo && !datos.password) delete datos.password;
        // Patrimonio ve todo el hospital, no se le asigna un área operativa.
        if (datos.rol === 'admin') delete datos.area_id;

        const peticion = esNuevo
            ? axios.post('/users', datos)
            : axios.put(`/users/${editando}`, datos);

        peticion
            .then(() => cargarUsuarios())
            .then(() => cerrarFormulario())
            .catch((error) => {
                const data = error.response?.data;
                if (error.response?.status === 422 && data?.errors) {
                    const planos = {};
                    Object.entries(data.errors).forEach(([campo, mensajes]) => {
                        planos[campo] = Array.isArray(mensajes) ? mensajes[0] : mensajes;
                    });
                    setErrors(planos);
                } else {
                    setErrorGeneral(data?.message || 'No se pudo guardar el usuario.');
                }
            })
            .finally(() => setGuardando(false));
    }

    function cambiarEstado(usuario) {
        const desactivando = usuario.activo !== false;
        const mensaje = desactivando
            ? `¿Desactivar a ${usuario.name}? Va a perder el acceso y dejará de aparecer como posible responsable, pero su historial se conserva.`
            : `¿Reactivar a ${usuario.name}?`;

        if (!window.confirm(mensaje)) return;

        axios.put(`/users/${usuario.id}`, { activo: !desactivando })
            .then(() => cargarUsuarios())
            .catch((error) => {
                window.alert(error.response?.data?.message || 'No se pudo cambiar el estado del usuario.');
            });
    }

    const claseCampo = (campo) => `w-full rounded-lg text-sm text-gray-700 shadow-sm ${
        errors[campo]
            ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
            : 'border-gray-300 focus:border-institucional-primario focus:ring-institucional-primario'
    }`;

    const rolSeleccionado = ROLES.find(r => r.valor === form.rol);

    return (
        <SidebarLayout>
            <Head title="Configuración del Sistema" />

            <div className="max-w-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-institucional-primario">Configuración del Sistema</h2>
                    <p className="text-sm text-gray-500 mt-1">Áreas y cuentas de acceso al portal.</p>
                </div>

                {cargando ? <LoadingState mensaje="Cargando configuración..." /> : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Áreas */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
                        <div className="flex items-center gap-2 mb-3">
                            <BuildingOffice2Icon className="h-5 w-5 text-institucional-primario" />
                            <h3 className="text-lg font-bold text-gray-900">Áreas</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{areas.length} registradas</p>
                        <div className="space-y-2">
                            {areas.map(a => <div key={a.id} className="text-sm text-gray-700">{a.nombre}</div>)}
                            {areas.length === 0 && <div className="text-sm text-gray-500">Sin áreas cargadas.</div>}
                        </div>
                    </div>

                    {/* Usuarios */}
                    <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5 text-institucional-primario" />
                                <h3 className="text-lg font-bold text-gray-900">Usuarios</h3>
                                <span className="text-sm text-gray-500">· {activos} activos de {usuarios.length}</span>
                            </div>
                            {editando === null && (
                                <button
                                    type="button"
                                    onClick={abrirNuevo}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-institucional-primario px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Nuevo usuario
                                </button>
                            )}
                        </div>

                        {sinArea.length > 0 && editando === null && (
                            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
                                <p>
                                    {sinArea.length === 1 ? 'Hay 1 usuario sin área asignada' : `Hay ${sinArea.length} usuarios sin área asignada`}
                                    {' '}({sinArea.map(u => u.name).join(', ')}). Sin área no ven ningún bien: asignales una editando la cuenta.
                                </p>
                            </div>
                        )}

                        {editando !== null && (
                            <form onSubmit={guardar} className="mb-6 rounded-xl border border-gray-200 bg-gray-50/60 p-5">
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-institucional-primario">
                                    {editando === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}
                                </h4>

                                {errorGeneral && (
                                    <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorGeneral}</p>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="u-name" className="mb-1 block text-xs font-medium text-gray-600">Nombre y apellido *</label>
                                        <input id="u-name" name="name" value={form.name} onChange={handleChange} className={claseCampo('name')} />
                                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="u-email" className="mb-1 block text-xs font-medium text-gray-600">Correo institucional *</label>
                                        <input id="u-email" name="email" type="email" value={form.email} onChange={handleChange} className={claseCampo('email')} />
                                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="u-rol" className="mb-1 block text-xs font-medium text-gray-600">Rol *</label>
                                        <select id="u-rol" name="rol" value={form.rol} onChange={handleChange} className={claseCampo('rol')}>
                                            {ROLES.map(r => <option key={r.valor} value={r.valor}>{r.etiqueta}</option>)}
                                        </select>
                                        {errors.rol
                                            ? <p className="mt-1 text-xs text-red-600">{errors.rol}</p>
                                            : <p className="mt-1 text-xs text-gray-500">{rolSeleccionado?.ayuda}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="u-area" className="mb-1 block text-xs font-medium text-gray-600">
                                            Área {form.rol !== 'admin' && '*'}
                                        </label>
                                        <select
                                            id="u-area"
                                            name="area_id"
                                            value={form.area_id}
                                            onChange={handleChange}
                                            disabled={form.rol === 'admin'}
                                            className={`${claseCampo('area_id')} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                                        >
                                            <option value="">{form.rol === 'admin' ? 'Ve todas las áreas' : 'Seleccione un área'}</option>
                                            {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                        </select>
                                        {errors.area_id
                                            ? <p className="mt-1 text-xs text-red-600">{errors.area_id}</p>
                                            : <p className="mt-1 text-xs text-gray-500">Define qué bienes va a ver.</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="u-password" className="mb-1 block text-xs font-medium text-gray-600">
                                            Contraseña {editando === 'nuevo' ? '*' : '(dejar vacío para no cambiarla)'}
                                        </label>
                                        <input id="u-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} className={claseCampo('password')} />
                                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={guardando}
                                        className="rounded-lg bg-institucional-primario px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {guardando ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cerrarFormulario}
                                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="pb-3 pr-4 font-bold">Usuario</th>
                                        <th className="pb-3 pr-4 font-bold">Área</th>
                                        <th className="pb-3 pr-4 font-bold">Rol</th>
                                        <th className="pb-3 pr-4 font-bold">Estado</th>
                                        <th className="pb-3 font-bold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {usuarios.map((u) => {
                                        const activo = u.activo !== false;
                                        const esUsuarioActual = String(u.id) === String(usuarioActualId);

                                        return (
                                            <tr key={u.id} className={activo ? '' : 'bg-gray-50/60'}>
                                                <td className="py-3 pr-4">
                                                    <p className={`font-medium ${activo ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {u.name}
                                                        {esUsuarioActual && <span className="ml-1.5 text-xs font-normal text-gray-400">(vos)</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {u.area?.nombre
                                                        ? <span className="text-gray-700">{u.area.nombre}</span>
                                                        : u.rol === 'admin'
                                                            ? <span className="text-xs italic text-gray-400">Todas</span>
                                                            : <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                                                                  <ExclamationTriangleIcon className="h-3.5 w-3.5" /> Sin asignar
                                                              </span>}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ROL_CLASES[u.rol] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                        {u.rol || 'sin rol'}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                                                        activo ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'
                                                    }`}>
                                                        {activo ? 'Activo' : 'Desactivado'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirEdicion(u)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                                    >
                                                        <PencilSquareIcon className="h-3.5 w-3.5" />
                                                        Editar
                                                    </button>
                                                    {!esUsuarioActual && (
                                                        <button
                                                            type="button"
                                                            onClick={() => cambiarEstado(u)}
                                                            className={`ml-2 inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                                                                activo
                                                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                                    : 'border-green-200 text-green-700 hover:bg-green-50'
                                                            }`}
                                                        >
                                                            {activo
                                                                ? <><NoSymbolIcon className="h-3.5 w-3.5" /> Desactivar</>
                                                                : <><ArrowPathIcon className="h-3.5 w-3.5" /> Reactivar</>}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {usuarios.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-sm text-gray-500">Sin usuarios cargados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </SidebarLayout>
    );
}
