# Plan — acciones con íconos, filtros con botón y localizador en tabla

Entra en el commit de U1; U4 lo borra.

## Context

El plan `ux-tablas-filtros-localizador` (commits `e914436`..`e5eb76b`) aplicó la
recomendación de D2, D3 y D4, pero el usuario había elegido sus **alternativas** de
la fase 0. D1 (la fila abre su detalle: el identificador es el enlace que cubre la
fila) y D5 (nombres y vueltas) quedan como están. Este plan rehace D2, D3 y D4. No
se toca backend: los datos ya llegan.

## Decisiones

Confirmadas por el usuario el 10/11/2026.

- **D2 — Acciones de fila: íconos sueltos.** Columna «Acciones» a la derecha, sin
  botones con texto: `Boton tamano="icono" forma="grupo"`, `fantasma` (lo
  destructivo, `fantasmaPeligro`, al final), con `aria-label` (qué y sobre qué) y
  `title` (el tooltip). No vuelve el ojo «Ver»: la fila ya abre su detalle.
  `MenuDeAcciones` sólo en el control patrimonial, con ícono en **todos** los
  ítems. Por qué: es lo que el usuario eligió; el texto + ⋮ no lo convenció y los
  ítems del ⋮ mezclaban con y sin ícono.
- **D2 — Control: ícono del paso que sigue + ⋮.** Un clic para avanzar el estado;
  los íconos de estado son los de las métricas del dashboard, así se aprenden una
  vez. Por qué: es la acción más frecuente de Gestión de Bienes.
- **D3 — Filtros con botón, como quirofanohu** (`FiltroCirugias.jsx`, commit
  `86671c3`): los campos y, en una columna `auto` del mismo renglón, «Filtrar» y
  «Limpiar filtros» (éste sólo con filtros activos). No se aplican solos. Siguen
  dentro de la tarjeta «Movimientos», como en la fase 0.
  - **Enter filtra**: la barra es un `<form>`, como en quirofanohu.
  - **El CSV exporta lo aplicado** (lo que muestra la tabla), no lo tipeado: es lo
    que ya hace hoy.
- **D4 — Localizador: tabla de resultados.** Columnas Bien · Dónde está ·
  Responsable · Estado · Último traslado; la fila abre la ficha (D1). La celda del
  último traslado, en texto plano y sin enlace: «TK-12 [Estado]» y debajo «Origen →
  Destino · fecha · con/sin acuse». Por qué: un solo destino por fila; el detalle
  del traslado está en la ficha.
- **La ficha del bien conserva su línea de tiempo.** `ResumenTraslado` queda con un
  solo uso, así que pasa al final de `Bienes/Show.jsx` y se borra su archivo
  (`docs/frontend.md`: el código vive al lado de lo que lo usa).

### Íconos

| Acción | Ícono | Variante |
|---|---|---|
| Acusar recibo | `task_alt` | `fantasma` |
| Editar (usuario, área, bien) | `edit` | `fantasma` |
| Anular (bandeja) | `block` | `fantasmaPeligro` |
| Desactivar / Reactivar | `block` / `restore` | `fantasmaPeligro` / `fantasma` |
| Registrar en Diaguita · Pasar a Registrado | `inventory` | `fantasma` / ítem |
| Cerrar · Pasar a Cerrado | `check_circle` | `fantasma` / ítem |
| Pasar a Informado | `schedule` | ítem |
| Ver ficha del bien (⋮) | `inventory_2` | ítem |
| Anular (⋮ del control) | `block` | ítem `peligro separado` |

Orden: lo que avanza, editar, lo destructivo; el ⋮ último. Donde una acción falta
en algunas filas y la de su derecha no (bandeja: Anular; usuarios: la cuenta
propia), queda el hueco `<span className="size-control shrink-0" aria-hidden="true" />`
para que las columnas de íconos se alineen (un `Boton tamano="icono"` mide 42 px,
lo mismo que `size-control`).

## Unidades

Rama `feat/auditoria-frontend`. Cada unidad en su sesión de Sonnet con `/tarea`.
U1 y U3 tocan `docs/frontend.md` en secciones distintas (Layout y Datos).

### U1 — Regla de acciones con íconos + bandeja e inicio
- `docs/frontend.md` (Layout): la entrada «Una fila con ficha» deja sólo el enlace
  que cubre la fila; una entrada nueva «Las acciones de una fila» con D2 (≤ 4
  líneas): íconos `fantasma`/`fantasmaPeligro` con `aria-label` y `title`, lo
  destructivo al final, el hueco `size-control`, el ⋮ sólo en el control con ícono
  en cada ítem.
- `Pages/Recepcion/Index.jsx`: `[task_alt Acusar recibo][block Anular | hueco]`;
  se va `MenuDeAcciones`/`ItemDeMenu` del import. Anular sigue confirmando con
  `useConfirmacion`; acusar sigue deshabilitado mientras `acusando`.
- `Pages/Inicio/Index.jsx`: en «Para acusar recibo», el botón con texto pasa al
  ícono `task_alt` (`aria-label` con el TK). «Últimos tickets» sigue con el estado.
- Reglas: `puedeAcusar`/`puedeAnular` de `utils/movimientos.js`; comentarios según
  `docs/comentarios.md`.
- Revisar: cada ícono muestra su tooltip y el lector de pantalla lee «Acusar
  recibo del ticket TK-n»; los íconos de Anular quedan en la misma columna con y sin
  acuse; un clic en el ícono no abre el ticket; Tab llega al enlace y a cada ícono.
- Estado: hecha

### U2 — Control, usuarios, áreas y directorio
- `Components/Patrimonio/TablaControl.jsx`: `ICONO_ESTADO = { Informado:
  'schedule', Registrado: 'inventory', Cerrado: 'check_circle' }`; el paso que
  sigue pasa a ícono (`texto` de `PASO_SIGUIENTE` queda como `aria-label`/`title`
  con el TK); cada «Pasar a…» del ⋮ lleva el ícono de su estado; «Ver ficha del
  bien» y Anular, como hoy.
- `Components/Patrimonio/TablaUsuarios.jsx`: `[edit][block Desactivar | restore
  Reactivar]` sin ⋮; la cuenta propia, `[edit]` + hueco.
- `Components/Patrimonio/ListaDeAreas.jsx`: «Editar» con texto pasa al ícono
  `edit` (el `aria-label` que ya tiene, y `title`).
- `Pages/Patrimonio/Bienes/Index.jsx`: «Editar» pasa al ícono `edit`.
- Cuatro archivos: va a `implementador`.
- Revisar: el ⋮ del control tiene ícono en todos los ítems y Anular separado en
  rojo; el ícono del paso cambia entre Informado y Registrado y no aparece en
  Cerrado/Anulado; Desactivar y Anular piden confirmación; Editar abre el modal (o
  el renombre en el lugar) sin navegar.
- Estado: hecha

### U3 — Filtros del dashboard con «Filtrar»
- `Components/Patrimonio/FiltrosDashboard.jsx`: un `<form onSubmit={onFiltrar}>`
  con la grilla de `FiltroCirugias`: `grid grid-cols-1 gap-3 sm:grid-cols-2
  lg:grid-cols-4 2xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]` (string completo,
  por Tailwind) y una última celda `flex items-end gap-2 sm:col-span-2
  2xl:col-span-1` con `<Boton tipo="submit">Filtrar</Boton>` y, con
  `hayFiltrosActivos`, `Limpiar filtros` (`fantasma`, `grupo`). Props nuevas:
  `hayFiltrosActivos`, `onFiltrar`, `onLimpiar`. Los campos, como hoy (`Buscador`
  primero, fechas cruzadas).
- `Pages/Patrimonio/Dashboard.jsx`: se van el `useEffect` y `ESPERA_MS`;
  `onFiltrar` = `preventDefault` + `visitar(filtros)`; `onLimpiar` =
  `setFiltros(FILTROS_VACIOS)` + `visitar(FILTROS_VACIOS)`; en `acciones` de la
  tarjeta queda sólo «Exportar CSV» (con `aplicados`, sin cambios). Título,
  subtítulo y el lugar de los filtros (D5), como están.
- `utils/busqueda.js`: `ESPERA_MS` vuelve a ser una constante del archivo.
- `docs/frontend.md` (Datos): «Filtros» → un buscador solo se aplica al tipear
  (300 ms, `useBusquedaEnServidor`); una barra de varios campos, con «Filtrar» (o
  Enter) y «Limpiar filtros» en una columna `auto` del renglón, éste sólo con
  filtros activos. Desde la página 1 y en la URL.
- Revisar: cambiar un select no visita hasta «Filtrar» o Enter; «Limpiar filtros»
  aparece sólo con filtros aplicados y deja todo vacío; un rango inválido muestra
  el error; recargar conserva los filtros; el CSV coincide con la tabla aunque haya
  algo tipeado sin aplicar; a 1536 px los botones van en el mismo renglón que los
  campos y a 375 px no hay scroll de costado.
- Estado: hecha

### U4 — Localizador en tabla
- `Pages/Patrimonio/Localizador/Index.jsx`: la `Tarjeta` del buscador sigue;
  los resultados, en `Tarjeta titulo="Resultados" icono="travel_explore"
  contador={bienes.total}` con la tabla (`-mx-5 overflow-x-auto`,
  `min-w-[52rem]`, clases de tabla de hu-kit), sin columna de acciones:
  - Bien: el código es el enlace que cubre la fila (`patrimonio.bienes.show`), y
    debajo el nombre atenuado;
  - Dónde está: `ubicacion_actual?.nombre || area?.nombre`, en `font-semibold`;
  - Responsable, o «sin asignar» atenuado;
  - Estado: `Estado` con `tonoEstadoBien`;
  - Último traslado (`ultimosMovimientos[bien.id]`): «TK-n» + `Estado` con
    `tonoEstadoMovimiento`, y debajo, atenuado, «Origen → Destino · `fechaYHora` ·
    con acuse / sin acuse» (anulado: sin la parte del acuse); sin traslados,
    «Sin traslados» atenuado.
  - El vacío, `EstadoVacio enTarjeta` en una fila con `colSpan={5}`; el
    `Paginador` dentro de la tarjeta, `mt-4 empty:hidden`.
- Se borra `Components/Patrimonio/BienLocalizado.jsx`.
- `ResumenTraslado` pasa al final de `Pages/Patrimonio/Bienes/Show.jsx` (sin
  `export`, con sus imports) y se borra `Components/Patrimonio/ResumenTraslado.jsx`.
- Se borra este plan de `docs/planes/`.
- Revisar: un clic en cualquier parte de la fila abre la ficha; un bien sin
  traslados y uno con el último anulado se leen bien; la ficha sigue con su línea de
  tiempo y TK-n vuelve a la ficha; a 375 px la tabla scrollea dentro de la tarjeta.
- Estado: pendiente

## Verificación

- Cada unidad: `powershell -File ~/.claude/scripts/verificar.ps1` (tests + pint) y
  `npm run build`. Sin backend, los Feature no cambian; `ComentariosTest` controla
  los comentarios.
- `revisor-visual` con la URL y el `Revisar:` de la unidad, en claro, oscuro y
  375 px, sobre `MovimientosSeeder`: `coordinador@enfermeria.test` (bandeja,
  inicio), `gestor@patrimonio.test` (dashboard, directorio, localizador, ficha) y
  `admin@hospital.test` (configuración).
