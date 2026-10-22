import huKit from 'hu-kit/tailwind';

/*
 * La marca —colores, tipografía, capas, movimiento y el plugin de formularios—
 * viene del preset de `hu-kit`, compartido con los otros sistemas del
 * hospital. Acá va sólo lo propio de este sistema. Prohibido el color
 * arbitrario en JSX (bg-[#...]).
 */
/** @type {import('tailwindcss').Config} */
export default {
    presets: [huKit],
    // Sin los componentes de `hu-kit`, Tailwind no genera las clases que usan.
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
        './node_modules/hu-kit/componentes/**/*.{js,jsx}',
    ],
};
