import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary, ThemeProvider } from 'hu-kit/componentes';

const appName = import.meta.env.VITE_APP_NAME ?? 'Bienes HU';

createInertiaApp({
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <ThemeProvider usuarioInicial={props.initialPage.props?.auth?.usuario?.id ?? null}>
                    <App {...props} />
                </ThemeProvider>
            </ErrorBoundary>,
        );
    },
    progress: {
        color: '#C7A36E', // token `secondary` — este config no puede leer clases de Tailwind
    },
});
