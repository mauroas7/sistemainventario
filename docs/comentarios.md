# Comentarios

Es una convención verificada por un test, no una preferencia de estilo:
`tests/Unit/ComentariosTest.php` controla el largo y los banners en `app/`,
`routes/`, `database/`, `resources/js/` y `tests/`. Es la misma regla que
comparten los sistemas del hospital (`hu-kit`, skill `arquitectura-hu`).

## La idea de fondo

Un comentario describe **el código que está ahí, en presente**, para alguien que
abre el archivo por primera vez y no conoce ninguna versión anterior. Lo que no le
sirve a ese lector, sobra. **Límite: 4 líneas de prosa por comentario.**

## Las cuatro formas, y sólo estas cuatro

| Forma | Largo | Cuándo |
|---|---|---|
| **Rótulo** | 1 línea | Qué es una clase, un módulo o una función cuyo nombre no alcanza. La forma más común; la primera que hay que intentar. |
| **Contrafáctico** | 1–2 líneas | El código parece un error y no lo es. Dice qué pasa **sin** esa línea. |
| **TODO** | 1 línea | Lo que falta. El único comentario que puede hablar de algo que no está en el código. |
| **Docblock** | tags | `@throws`, `@return array<string, mixed>` cuando la firma no lo dice ya. Sin descripción que repita el nombre del método. |

```php
/** Patrimonio ya volcó el movimiento a Diaguita. */                        // rótulo
// Sin esto, anular un movimiento deja el bien donde lo dejó el anulado.     // contrafáctico
// TODO: falta el alta de bienes; hoy los inventa la demo.                  // pendiente
```

Si ninguna de las cuatro encaja, lo más probable es que el comentario no haga
falta. El default es no escribirlo.

## El contrafáctico va en presente

«Sin este chequeo, el bien queda en dos áreas» explica por qué existe la línea,
en presente. La misma idea en pasado («sin esto el bien **quedaba** en dos
áreas») convierte la explicación en una anécdota del arreglo.

## Lo que no va, nunca

- **Historia.** «Antes devolvía JSON», «la versión con API hacía X». Eso es
  trabajo del mensaje de commit: git guarda el pasado, el archivo guarda el
  presente.
- **Alegato.** El comentario dice qué hace el código, no defiende la decisión
  contra alternativas que nadie propuso.
- **Banners** (`// =====`, `///////`, `// 1. MÉTODO PARA X`). No dicen nada.
- **Código comentado.** Si no corre, se borra.
- **Segunda persona o anécdota** («como en el controller anterior»).

## Cómo se mide el límite

Cuenta el comentario **entero**: un docblock partido en párrafos con `*` vacíos
es un solo comentario de N líneas, no varios cortos. Las anotaciones (`@param`)
y los delimitadores no suman; sólo una línea de código o un renglón en blanco
cierran el bloque.

## Cuando el porqué no entra en 4 líneas

No va en el código: va en el documento de la zona, en `docs/`, y el código
enlaza (*«ver `docs/arquitectura.md`»*).

| Zona | Documento |
|---|---|
| Backend, roles, el circuito de un movimiento, datos, tests | [`docs/arquitectura.md`](arquitectura.md) |
| `resources/js/` | [`docs/frontend.md`](frontend.md) |
