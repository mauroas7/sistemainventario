import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
    // Relativa en el build: chunks, tipografías e imágenes se piden desde donde
    // está la app, así funciona en la raíz (sistemabienes.test) y en una
    // subcarpeta (http://IP/sistemabienes/public). En dev la maneja el plugin.
    base: command === 'build' ? './' : undefined,
    plugins: [
        laravel({
            // Una sola entrada: `app.jsx` importa `app.css`, así que Vite la
            // arrastra sola.
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        'react',
                        'react-dom',
                        '@inertiajs/react',
                        'axios',
                    ],
                },
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
}));
