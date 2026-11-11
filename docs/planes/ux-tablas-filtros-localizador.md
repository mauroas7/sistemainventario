# Plan — acciones de fila, filtros del dashboard y localizador (UX/UI)

## Context

El front de Bienes HU tiene tres cosas que no convencen y varios detalles sueltos:

- **Acciones de fila**: cinco lugares, cinco criterios. Bandeja `[👁][Acusar recibo][⋮ Anular]`;
  control `[Registrar en Diaguita][👁][⋮ estados + Anular]` (otro orden); usuarios
  `[Editar][Desactivar en rojo sólido]` con el encabezado a la izquierda; directorio
  `[Editar][🕘]`; áreas, un lápiz suelto; Inicio, `Ver` con texto. El ojo, el reloj y
  los íconos sin texto obligan a adivinar.
- **Filtros del dashboard** (`FiltrosDashboard.jsx`): una tarjeta aparte con 6 campos y
  «Aplicar filtros» / «Limpiar» en un renglón propio abajo. Además «Exportar CSV»
  exporta lo *aplicado*, no lo que se ve tipeado. En quirofanohu se resolvió en
  `FiltroCirugias.jsx` (commit `86671c3`): botones en una columna `auto` del mismo
  renglón y «Limpiar filtros» sólo con filtros activos. **No llegó a hu-kit** (v1.16.0
  no tiene barra de filtros).
- **Localizador**: cada bien es una tarjeta alta con 3 `Dato` + 7 `Dato` del último
  movimiento en una grilla de 4; se lee como un formulario, no dice si el traslado tiene
  acuse (el dato ya llega: `recibido_por`, `fecha_recepcion`) y el ticket no es enlace.
- **Detalles**: la ficha del bien usa un `Boton` «Volver al directorio» suelto (las
  fichas de ticket ya usan `volver` del encabezado) y muestra menos datos que la fila
  del directorio; la auditoría siempre vuelve «al dashboard» aunque se llegue desde la
  ficha del bien; la página dice «Control patrimonial» y el menú «Dashboard
  patrimonial»; el subtítulo del dashboard es el nombre del usuario; el vacío del
  localizador va suelto, sin `enTarjeta`.

Resultado buscado: una sola regla para todo lo que se hace con una fila, filtros que no
piden botón, y un localizador que responde de un vistazo «dónde está y cómo llegó».

## Decisiones

D1–D5 están confirmadas: el usuario eligió la recomendación sobre cada alternativa al ver la fase 0 (10/11/2026).

- **D1 — La fila abre su detalle.** El identificador (`TK-12`, código del bien) es el
  enlace y cubre la fila: `relative` en el `tr`/`li`, `after:absolute after:inset-0` en
  el enlace, la celda de acciones `relative z-10`; foco visible en el enlace. Se van el
  ojo y el reloj. Por qué: es lo que el usuario ya intenta, y libera la columna. Una
  fila sin ficha (usuarios, áreas) no lleva enlace.
- **D2 — Acciones: una con texto + ⋮.** Columna «Acciones» a la derecha: a lo sumo una
  acción con texto (`contorno`, `grupo`), el paso que sigue (Acusar recibo, Registrar en
  Diaguita, Cerrar, Editar). Lo demás va en `MenuDeAcciones`; lo destructivo (Anular,
  Desactivar) siempre ahí, al final, `peligro separado`, con `ModalConfirmar`. Un ⋮ de
  un solo ítem se acepta: la regla no tiene excepciones (**decidido**). Donde unas filas
  tienen ⋮ y otras no (bandeja, la cuenta propia), el hueco queda reservado
  (`size-control`, `aria-hidden`) para que las acciones se alineen; donde ninguna lo
  tiene (directorio), no hay hueco. Por qué: texto antes que íconos para usuarios no
  técnicos; el rojo sólido queda para el modal (regla de quirofanohu). *Alternativa en
  la fase 0:* íconos sueltos (`fantasma`/`fantasmaPeligro`) y ⋮ sólo en el control.
- **D3 — Los filtros se aplican solos.** Sin «Aplicar»: cualquier cambio visita tras
  300 ms de quietud (un select se siente inmediato, el texto no dispara una visita por
  letra), desde la página 1. El bien pasa a `Buscador`. Los filtros entran en la tarjeta
  «Movimientos», arriba de la tabla; «Limpiar filtros» va en `acciones` de la tarjeta
  junto a «Exportar CSV», sólo con filtros activos. En celular, siempre visibles y
  apilados (**decidido**). Por qué: no hay botón que ubicar, una tarjeta menos, y el CSV
  exporta lo que se ve. *Alternativa en la fase 0:* la de quirofanohu (Filtrar +
  Limpiar en la columna `auto` del renglón).
- **D4 — Localizador: dónde está + cómo llegó.** Tarjeta por bien en dos columnas
  (`grid-cols-1 lg:grid-cols-2`): «Dónde está» (ubicación en grande, área, responsable,
  estado del bien, Diaguita) y «Último traslado», un bloque compacto: `TK-12` enlazado +
  estado + fecha; origen → destino; responsable anterior → nuevo · motivo; acuse
  («Acusado por X el …» / «Sin acuse de recibo»). Un traslado anulado se ve atenuado con
  su estado (el último puede ser anulado: `Bien::ultimoMovimiento` los incluye). El
  mismo bloque (`Components/Patrimonio/ResumenTraslado.jsx`: dos usos con el mismo
  significado) arma el registro de la ficha del bien como línea de tiempo.
  *Alternativa en la fase 0:* una tabla de resultados con el último traslado en una
  columna.
- **D5 — Nombres y vueltas.** La página se titula «Dashboard patrimonial», como el menú
  y el «Volver al dashboard», con un subtítulo que dice qué es la pantalla. La auditoría
  abierta desde la ficha o el localizador lleva `?desde=bien` y vuelve «a la ficha del
  bien» (el mismo recurso que `ver` en `Recepcion/Show.jsx`).

No se toca backend: los datos ya llegan (`MovimientoService::RELACIONES` incluye
`receptor`; `BienController::show` y `LocalizadorController` los mandan).

## Unidades

Rama: `feat/auditoria-frontend` (**decidido**). Al aprobarse, el plan se copia a
`docs/planes/ux-tablas-filtros-localizador.md` y entra en el commit de U1.

### U0 — Fase 0: comparativa antes / después (HTML)
- La hace Opus en esta sesión, al aprobar el plan (**decidido**), como Artifact privado
  (fuente en el scratchpad). No es un commit ni toca el sistema.
- Reproduce con los tokens de hu-kit (Tailwind CDN con los colores del preset,
  Montserrat, Material Symbols) cada vista **antes** y **después**, con un selector por
  vista: Bandeja de recepción, Inicio, Dashboard (filtros + tabla), Usuarios y áreas,
  Directorio, Localizador, Ficha del bien. D2, D3 y D4 muestran además su alternativa.
  Datos de la demo (TK-, áreas, «Nombre Test»), claro y oscuro, y un ancho de celular.
- Revisar: el usuario confirma D1–D4 o elige alternativas; el plan se ajusta antes de U1.
- Estado: hecha (https://claude.ai/artifact/KDZmHPfBoPfRprc3yxQEmn); D1–D4 confirmadas

### U1 — Regla de acciones de fila + bandeja e inicio
- `docs/frontend.md` (Layout): D1 y D2 en una entrada de ≤ 4 líneas.
- `Pages/Recepcion/Index.jsx`: fila → `recepcion.show` (con `ver`); `[Acusar recibo][⋮ Anular]`.
- `Pages/Inicio/Index.jsx` (`Renglon`): el renglón entero abre el ticket, marcado con
  `renglonTabla`; se van «Ver» y el ojo; queda «Acusar recibo» o el estado.
- Reglas: `puedeAcusar`/`puedeAnular` de `utils/movimientos.js`; `MenuDeAcciones`,
  `ItemDeMenu`, `renglonTabla` de hu-kit; comentarios según `docs/comentarios.md`.
- Revisar: un clic en cualquier parte de la fila abre el ticket y en el botón o el ⋮ no;
  Tab llega al enlace y a las acciones; acciones alineadas entre filas; acusar sigue
  deshabilitándose mientras se envía.
- Estado: hecha

### U2 — Acciones de control, usuarios, áreas y directorio
- `Components/Patrimonio/TablaControl.jsx`: fila → auditoría; `[paso siguiente][⋮ Pasar
  a…, Ver ficha del bien, ─ Anular]`.
- `Components/Patrimonio/TablaUsuarios.jsx`: `[Editar][⋮ Desactivar | Reactivar]`,
  encabezado a la derecha; la cuenta propia, `[Editar]` + hueco.
- `Components/Patrimonio/ListaDeAreas.jsx`: el lápiz pasa a «Editar» con texto.
- `Pages/Patrimonio/Bienes/Index.jsx`: fila → ficha del bien; `[Editar]`, sin hueco.
- Cuatro archivos: va a `implementador`.
- Revisar: Anular y Desactivar sólo desde el ⋮ y piden confirmación; Editar abre el
  modal (o el renombre en el lugar) sin navegar.
- Estado: pendiente

### U3 — Filtros del dashboard
- `Components/Patrimonio/FiltrosDashboard.jsx`: sin `Tarjeta` ni `form`; grilla
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6`, el `Buscador` del bien
  primero; `SelectorFecha` con `desde`/`hasta` cruzados, como `FiltroCirugias`.
- `Pages/Patrimonio/Dashboard.jsx`: los filtros dentro de «Movimientos» con su `Alerta`
  de error; un efecto sobre `filtros` que, a los 300 ms, visita si difieren de
  `aplicados` comparados como texto (el servidor puede devolver números); «Limpiar
  filtros» en `acciones` con `hayFiltrosActivos`; título y subtítulo de D5. El efecto
  vive en la página (un solo uso).
- `docs/frontend.md` (Datos): los filtros se aplican al cambiar.
- Revisar: un select filtra sin botón; tipear no dispara una visita por letra; un rango
  inválido muestra el error y no entra en bucle; recargar conserva los filtros (URL); el
  CSV coincide con la tabla; a 375 px no hay scroll de costado.
- Estado: pendiente

### U4 — Localizador y fichas
- Nuevo `Components/Patrimonio/ResumenTraslado.jsx`: el bloque de D4, con `TK-` enlazado
  a `patrimonio.movimientos.show` con `desde=bien`.
- `Components/Patrimonio/BienLocalizado.jsx`: «Dónde está» / «Último traslado»; «Ver
  ficha» en `acciones`. `Pages/Patrimonio/Localizador/Index.jsx`: el vacío con
  `enTarjeta` dentro de una `Tarjeta`.
- `Pages/Patrimonio/Bienes/Show.jsx`: `volver` y `estado` en el encabezado; datos
  completos (Diaguita, área, responsable); el registro como línea de tiempo de
  `ResumenTraslado`.
- `Pages/Patrimonio/Movimientos/Show.jsx`: `desde=bien` → «Volver a la ficha del bien».
- Cinco archivos: va a `implementador`. Borra el plan de `docs/planes/`.
- Revisar: un bien sin movimientos dice que está donde se dio de alta; un anulado se ve
  atenuado; el acuse se ve; ida y vuelta localizador → auditoría → ficha.
- Estado: pendiente

U1–U4 tocan archivos distintos salvo `docs/frontend.md` (U1 y U3, en ese orden). Cada
una en su sesión de Sonnet con `/tarea`.

## Verificación

- Cada unidad: `powershell -File ~/.claude/scripts/verificar.ps1` (tests + pint) y
  `npm run build`. No hay backend: los Feature no deberían cambiar; `ComentariosTest`
  controla los comentarios nuevos.
- `revisor-visual` con la URL y el `Revisar:` de la unidad, en claro, oscuro y 375 px,
  con `gestor@patrimonio.test`, `coordinador@enfermeria.test` y `admin@hospital.test`
  sobre `MovimientosSeeder`.

## Fuera de alcance
- Llevar la barra de filtros y el enlace de fila a hu-kit: recién cuando quirofanohu y
  este sistema los usen con la misma forma.
- Métricas del dashboard que filtran al tocarlas: es una función nueva.
