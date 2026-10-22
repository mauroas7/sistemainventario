import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import { Icono } from 'hu-kit/componentes';

const ITEM =
    'flex w-full items-center gap-3 px-5 py-3 text-sm font-black text-primary transition-colors hover:bg-canvas data-[focus]:bg-canvas dark:text-gray-100 dark:hover:bg-white/5 dark:data-[focus]:bg-white/5';

/**
 * Quién está adentro y la salida, como en portal-hospital: nombre, rol e inicial
 * abren un menú con la cuenta y cerrar sesión. En celular queda sólo la inicial.
 */
export default function MenuDeUsuario({ usuario }) {
    const inicial = usuario.nombre?.trim().charAt(0).toUpperCase() || '?';

    return (
        <Menu as="div" className="relative">
            <MenuButton
                aria-label={`Menú de ${usuario.nombre}`}
                className="group flex items-center gap-3 rounded-xl text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary"
            >
                <span className="hidden max-w-56 sm:block">
                    <span className="block truncate text-[13px] font-black uppercase leading-none text-primary dark:text-gray-100">
                        {usuario.nombre}
                    </span>
                    <span className="mt-1.5 block truncate text-xs font-black uppercase tracking-[0.15em] text-secondary-dark dark:text-secondary">
                        {usuario.area?.nombre ?? usuario.rolEtiqueta}
                    </span>
                </span>

                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-white shadow-md transition-transform dark:bg-primary-light group-hover:scale-105">
                    {inicial}
                </span>
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 top-full z-dropdown mt-3 w-64 max-w-[90vw] origin-top-right rounded-2xl border border-brandText-soft/80 bg-white py-2 shadow-2xl transition duration-150 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-gray-800 dark:bg-surface-dark"
            >
                {/* Nombre y área ya están en el botón desde `sm`: acá sólo los ve el celular, que muestra la inicial. */}
                <div className="border-b border-brandText-soft/40 px-5 pb-3 pt-2 dark:border-gray-800">
                    <p className="truncate text-sm font-black text-primary sm:hidden dark:text-gray-100">{usuario.nombre}</p>
                    <p className="truncate text-xs text-brandText-muted dark:text-brandText-mutedDark">{usuario.email}</p>
                    <p className="mt-1.5 text-xs font-black uppercase tracking-[0.15em] text-secondary-dark dark:text-secondary">
                        {usuario.rolEtiqueta}
                    </p>
                </div>

                <div className="border-b border-brandText-soft/40 py-1 dark:border-gray-800">
                    <MenuItem>
                        <Link href={route('cuenta')} className={ITEM}>
                            <Icono nombre="manage_accounts" className="text-xl text-secondary-dark dark:text-secondary" />
                            Mi cuenta
                        </Link>
                    </MenuItem>
                </div>

                <MenuItem>
                    <button
                        type="button"
                        onClick={() => router.post(route('logout'))}
                        className="mt-1 flex w-full items-center gap-3 px-5 py-3 text-sm font-black uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 data-[focus]:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 dark:data-[focus]:bg-red-950/30"
                    >
                        <Icono nombre="logout" className="text-xl" /> Cerrar sesión
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
