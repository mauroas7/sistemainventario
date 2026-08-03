import React from 'react';

export default function LoadingState({ mensaje = 'Cargando...' }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <span className="h-8 w-8 rounded-full border-2 border-institucional-primario/20 border-t-institucional-primario animate-spin" />
            {mensaje}
        </div>
    );
}
