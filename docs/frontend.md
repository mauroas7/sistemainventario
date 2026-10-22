# Frontend — React + Inertia

Todo el sistema es React 18 + Inertia 2: ningún controlador devuelve `view()`.
Lo único de Blade es `resources/views/app.blade.php`, la plantilla raíz que
Inertia necesita, y las vistas de los mails. La referencia de estructura es
**quirofanohu** y la de marca, **portal-hospital**; la marca se aplica con la
skill `marca-hu` de `hu-kit` para quien usa Claude Code, y lo que hace falta para
trabajar sin ella está en este documento.

## Dónde va cada cosa

```
resources/js/
├── Components/
│   ├── UI/            ← el marco de la app; las primitivas vienen de hu-kit
│   ├── Envio/         ← las partes del formulario de envío
│   └── Patrimonio/    ← las partes del control patrimonial
├── Pages/             ← páginas Inertia, y sólo eso
├── data/              ← contenido sin lógica (el mapa del menú)
└── utils/             ← transformar, formatear, decidir qué se ofrece
```

**En `Pages/` van sólo páginas Inertia**: `app.jsx` resuelve con
`import.meta.glob('./Pages/**/*.jsx')`, así que todo lo que quede ahí es un
nombre resoluble por `Inertia::render()`. Por eso `AppLayout` vive en
`Components/UI/`.

**Todos los `import` entre carpetas usan el alias `@/`**, nunca rutas relativas.

## Marca

La marca no vive en este repo: es el paquete **`hu-kit`**, el mismo para todos los
sistemas del hospital. Trae el preset de Tailwind, los estilos base, las fuentes
y los componentes, que se importan de `hu-kit/componentes`:

- formularios: `Boton`, `Campo` y `claseControl`, `Input`, `PasswordInput`,
  `Select`, `Textarea`, `Checkbox`, `SelectorFecha`;
- contenido: `Tarjeta`, `Estado`, `EstadoVacio`, `Alerta`, `Rotulo`, `Metrica`,
  `Paginador` y las clases de tabla (`encabezadoTabla`, `cuerpoTabla`,
  `renglonTabla`);
- `Modal`, `ModalConfirmar` y `useConfirmacion`;
- `Icono`, `ApplicationLogo`, `PanelAutenticacion`, `ErrorBoundary`,
  `ThemeToggle` y `ThemeProvider`.

En `Components/UI/` queda sólo el marco de este sistema: `AppLayout`, `Nav`,
`MenuDeUsuario`, `Flash`, `PanelDeIngreso` (los textos del login sobre
`PanelAutenticacion`) y `Dato` (una etiqueta con su valor).

`tailwind.config.js` carga el preset y suma los componentes del paquete a
`content`, sin lo cual Tailwind no genera sus clases; `resources/css/app.css`
importa `hu-kit/estilos.css`.

`hu-kit` se instala fijado a un tag (`github:mauroas7/hu-kit#vX.Y.Z`): un cambio de
marca llega cuando se sube el tag, no solo. Un color o un componente que falta se
agrega en `hu-kit`, nunca acá. Se actualiza con
`npm install hu-kit@github:mauroas7/hu-kit#vX.Y.Z`: cambiar el tag a mano en
`package.json` deja en el lock el commit anterior. `.npmrc` instala con
`ignore-scripts`, así que ninguna dependencia corre código al instalarse.

**Color**: todo color es un token del preset o una clase estándar de Tailwind
(`red-700`, `gray-500`). **Nunca `bg-[#...]` ni ningún valor arbitrario.**

**Contraste**: todo texto llega a 4,5:1. El dorado como texto sobre fondo claro
es `secondary-dark`; `secondary` sólo sobre `primary`. El texto secundario es
`brandText-muted`. Ningún texto de menos de 12 px (`text-xs`).

**Tipografía**: Montserrat en tres pesos, `font-normal`, `font-semibold` y
`font-black`. **No usar `font-bold` ni `font-medium`**: no están cargados y el
navegador los resuelve a otro peso.

**Botones**: siempre `Boton`. `forma="confirmacion"` (por defecto,
`rounded-full`) para lo que envía o cierra una acción; `forma="grupo"`
(`rounded-xl`) para lo que navega, filtra o actúa sobre una fila. El tamaño va
por `tamano`, nunca por `className`.

**Íconos**: Material Symbols Outlined con `<Icono nombre="..." />`; `relleno`
sólo para la sección activa del menú.

**Modo oscuro**: `ThemeProvider` en `app.jsx` y `ThemeToggle` en la cabecera.
**No se persiste**: las máquinas del hospital son compartidas, así que arranca en
claro y se resetea cuando cambia el usuario. Todo componente nace con sus pares
`dark:` (`bg-white`→`dark:bg-surface-dark`, `text-primary`→`dark:text-gray-100`,
`text-brandText-muted`→`dark:text-brandText-mutedDark`,
`border-brandText-soft/70`→`dark:border-gray-800`).

## Layout

- **Ancho** → prop `ancho` de `AppLayout`: `completo` (por defecto) para tablas
  y tableros, `lectura` para fichas y detalle, `formulario` para una columna de
  tarjetas (Mi cuenta).
- **Grillas**: siempre con `grid-cols-1` de base, o en celular la página
  entera scrollea de costado.
- **Tablas** → adentro de una `Tarjeta`, en un `-mx-5 overflow-x-auto` con un
  `min-w-*` en la tabla, y las clases de tabla de `hu-kit`. La primera y la
  última columna van a `px-5`.
- **Una lista vacía** → `EstadoVacio` con `enTarjeta`.
- **Una etiqueta con su valor** → `Dato`. **Un subtítulo dentro de una
  tarjeta** → `Rotulo`.
- **El contenedor de `Paginador`** lleva `empty:hidden`.
- **El menú** sale de `data/navegacion.js`, filtrado por rol en
  `utils/secciones.js`. Una sección nueva se agrega ahí y su ruta lleva el mismo
  `rol:` en `routes/web.php`.

## Formularios

Con `useForm` de Inertia: el valor y los errores son del formulario que los
pidió.

- **Campos** → `Input`, `Select`, `Textarea` o un control propio adentro de
  `Campo`, que dibuja la etiqueta, la ayuda y el error. Contraseñas →
  `PasswordInput`.
- **`Select` recibe pares** `[valor, etiqueta]` en el orden en que se muestran;
  la pantalla los arma con un `map`.
- **Fechas** → `SelectorFecha`, nunca `type="date"`.
- **Una acción destructiva** (anular, desactivar) confirma con `ModalConfirmar` y
  `useConfirmacion`, nunca con `window.confirm()`:

```jsx
const { confirmar, props: modal } = useConfirmacion();

confirmar({
    titulo: `Anular el ticket TK-${m.id}`,
    detalle: 'El bien vuelve a su ubicación y responsable anteriores.',
    textoAceptar: 'Anular',
    accion: (r) => r.post(route('recepcion.anular', { movimiento: m.id })),
});

<ModalConfirmar {...modal} />
```

- **Lo que el usuario puede hacer** con un movimiento sale de
  `utils/movimientos.js` (`puedeAcusar`, `puedeAnular`): no se ofrece un botón
  que el servidor después rechaza. El servidor lo verifica igual.

## Datos

- **Carga inicial** → props de Inertia. No hay API ni `axios` a rutas propias:
  una acción es un `router.post/patch` o un `useForm` que vuelve con la página.
- **Listados largos** → el paginador de Laravel tal cual (`data`, `links`,
  `total`), que `Paginador` sabe dibujar.
- **Fechas** → viajan en ISO 8601 con huso, nunca formateadas; las formatea
  `utils/fechas.js`.
- **Rutas** → `route()` de Ziggy. Para saber en qué ruta estás,
  `utils/rutas.js`: un patrón terminado en `.` es un prefijo.
- **Props compartidas** → `HandleInertiaRequests::share()` manda `auth.usuario`
  (`id`, `nombre`, `email`, `rol`, `rolEtiqueta`, `area`) y `flash` (`exito`,
  `error`), que muestra `Flash`.
- **La foto de un movimiento** llega como `imagen_salida_url`, una ruta con
  permiso; nunca se arma a mano.

## Cuidados para Linux / Docker

El desarrollo es en Windows, que no distingue mayúsculas; el servidor sí. La caja
de un `import` (`@/utils/Fechas` contra `@/utils/fechas`) compila en Windows y
rompe en Linux. Los assets se compilan con `base: './'`, así que el sistema
funciona servido desde una subcarpeta.

## Convenciones

- Nombres, comentarios y textos en español, con voseo rioplatense.
- Las props que se declaran se usan: si una queda sin consumir, se saca de la
  firma y del lugar que la pasa.
- Lo que no es dibujar va a `utils/`. Antes de escribir un helper, mirar si ya
  está ahí o en `hu-kit`.
