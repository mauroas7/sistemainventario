import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                institucional: {
                    primario: '#003764', // Azul oscuro
                    secundario: '#C7A36E', // Dorado/Arena
                    fondo: '#F4F7F9', // Gris azulado claro para el fondo (basado en el prototipo)
                }
            }
        },
    },

    plugins: [forms],
};