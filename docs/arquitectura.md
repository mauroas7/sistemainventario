# Arquitectura

Cómo está armado Bienes HU y por qué. La puesta en marcha y los usuarios de
prueba están en el [`README.md`](../README.md); el resto, en:

| Zona | Documento |
|---|---|
| `resources/js/` | [`docs/frontend.md`](frontend.md): leelo antes de tocar el frontend |
| Comentarios en todo el código | [`docs/comentarios.md`](comentarios.md) |

## Capas

Controller → Service → modelos, la misma regla que los otros sistemas del
hospital (skill `arquitectura-hu` de `hu-kit`):

- **Los controladores** (`app/Http/Controllers/**`) resuelven la petición,
  delegan y devuelven `Inertia::render(...)` o un redirect con `exito`. Ningún
  controlador devuelve JSON: todo es una página o una acción de Inertia.
- **La validación de la entrada** va en un form request (`app/Http/Requests/`).
- **La lógica del circuito** vive en `App\Services\MovimientoService`; los mails,
  en `NotificacionMovimientoService`. Un servicio no recibe el `Request`.
- **Un error del dominio** («el movimiento fue anulado») es una
  `ValidationException` con la clave del campo, o `movimiento` / `general` si no
  hay campo: la pantalla lo muestra como cualquier error de formulario.

`tests/Unit/ArquitecturaTest.php` controla las tres fronteras: los controladores
no hacen entrada/salida externa, los servicios no conocen la capa HTTP y los
modelos no dependen de las capas de arriba. Su lista `PERDONADOS` está vacía y
sólo puede seguir así.

## Autenticación y roles

Auth estándar de Laravel: tabla `users`, guard de sesión, correo y contraseña,
con recuperación de clave por mail. **No hay registro público**: las cuentas las
da de alta un administrador desde Configuración, y el primero se crea con
`php artisan usuarios:crear-administrador`. Una cuenta dada de baja
(`users.fecha_baja`) no puede iniciar sesión (`LoginRequest`); nadie se da de baja
a sí mismo y siempre queda al menos un administrador activo.

`App\Enums\Rol` guarda un **slug** en `users.rol` y `etiqueta()` da el nombre que
se muestra. Las rutas declaran `rol:admin` (alias de `VerificarRol`); el código
pregunta con `User::tieneRol()`, que acepta el enum, el slug o la etiqueta.

| Rol | Qué ve | Qué hace |
|---|---|---|
| Administrador (Gestión de Bienes) | Todo el hospital, sin área | Informa, recibe y anula como cualquiera; además el control patrimonial: tablero, estados, responsables, localizador, directorio y usuarios |
| Coordinador / Jefe de área | Lo que sale de su área o llega a ella | Informa traslados de sus bienes, acusa recibo y anula lo que informó |
| Usuario | Igual que el coordinador | Igual que el coordinador |

**Coordinador y Usuario tienen hoy los mismos permisos**: sólo cambia la
etiqueta. **El área es lo que define qué ve cada uno** (`MovimientoService::puedeVer()`
y la consulta de la bandeja), por eso toda cuenta que no es administrador
necesita área.

El menú sale de `resources/js/data/navegacion.js`; quién entra a cada ruta, del
`rol:` en `routes/web.php`. Si se toca uno, hay que revisar el otro: nada los ata.

## El circuito de un movimiento

1. **Envío** (`envio.crear`): alguien del área informa que un bien cambia de
   lugar, con una foto opcional. **El traslado es efectivo en el acto**: el bien
   pasa al área destino y al nuevo responsable sin esperar confirmación. Si no se
   eligió responsable, queda «a definir por Gestión de Bienes».
2. **Avisos**: salen en el mismo pedido (ver *Mails*).
3. **Recepción** (`recepcion.*`): quien recibe acusa recibo. El acuse es una
   constancia; no cambia ni la ubicación ni el estado.
4. **Control patrimonial** (`patrimonio.*`): Gestión de Bienes asigna el
   responsable si faltaba, vuelca el movimiento a Diaguita y hace firmar la ficha
   de inventario, moviendo el estado.

| Estado | Significa |
|---|---|
| Informado | Recién informado; falta volcarlo a Diaguita. Es el único que se puede anular desde Recepción |
| Registrado | Ya está en Diaguita (`registrado_por`, `fecha_registro_diaguita`) |
| Cerrado | La ficha está firmada (`fecha_cierre`) |
| Anulado | Se informó por error; borra el acuse |

Los estados se buscan por nombre, así que los siembra `Catalogos/SistemaSeeder`
en todos los entornos. Cada cambio de estado queda en
`historial_estados_movimiento` (lo escribe el modelo `Movimiento` al crearse o
actualizarse), que la auditoría muestra.

**Dónde está un bien se calcula, no se arrastra.**
`MovimientoService::sincronizarUbicacionBien()` toma el movimiento no anulado más
reciente del bien y copia su área destino y su responsable nuevo, aunque sea
`null`. Sin ninguno vigente, el bien vuelve al origen del primero. Por eso anular
un movimiento devuelve el bien a donde estaba, en el orden que sea.

## Mails

`NotificacionMovimientoService` manda tres avisos al informar un movimiento, en
el momento y sin cola:

- a **Gestión de Bienes** (`MovimientoInformadoPatrimonio`): las casillas de
  `PATRIMONIO_NOTIFICACIONES_EMAIL` o, si está vacío, todos los administradores;
- a **quien lo informó** (`MovimientoAcuseCreador`), como constancia;
- al **responsable saliente** (`MovimientoAvisoResponsableSaliente`), salvo que
  sea quien lo informó.

**Un mail que falla no deshace el movimiento**: queda en el log. `.env.example`
deja `MAIL_MAILER=log`; la configuración del relay del hospital está comentada
ahí mismo. Las vistas están en `resources/views/emails/movimientos/`.

## Fotos

La foto de un movimiento es un dato del bien y de quien lo tiene, así que no es
pública: va al disco `local` (`storage/app/private/movimientos/`) y la sirve
`recepcion.movimientos.foto`, que pregunta lo mismo que la pantalla del
movimiento (`MovimientoService::puedeVer()`). En la página llega como
`imagen_salida_url`, la ruta ya armada; nunca la ruta del archivo.

## Datos

`php artisan migrate --seed` siembra **sólo `Catalogos/`**, lo mismo en todos
los entornos:

- `SistemaSeeder`: los estados de movimiento, que el código busca por nombre;
- `ListasSeeder`: estados de bien, tipos de movimiento y motivos.

**La demo** (`Demo/DemoSeeder`) inventa las áreas, seis usuarios con clave
`password` y ocho bienes. Hereda de `SeederDePrueba`, que se niega a correr en
producción. Áreas y bienes todavía no tienen alta desde la aplicación.

### Migraciones: se edita el `create_*`, no se agrega otra (hasta producción)

Mientras el sistema no esté en producción, un cambio a una tabla existente va
directo a su migración `create_*`, y se reconstruye con
`php artisan migrate:fresh --seed`. Un archivo nuevo es sólo para una tabla
nueva. Desde la salida a producción, todo cambio de esquema es una migración
nueva y los archivos viejos no se tocan; ahí `migrate:fresh`,
`migrate:rollback` y `db:wipe` ya no corren (`DB::prohibitDestructiveCommands()`
en `AppServiceProvider`).

## Tests y verificación

Antes de dar algo por terminado: `php artisan test` (Pest, `tests/Unit` +
`tests/Feature`) y `./vendor/bin/pint`.

Los de `Feature` corren sobre el SQLite en memoria de `phpunit.xml`, con
`RefreshDatabase`. Los de `Unit` son convenciones verificadas: capas
(`ArquitecturaTest`), comentarios (`ComentariosTest`, ver
[`comentarios.md`](comentarios.md)) y que toda clave de `lang/es` exista
(`TraduccionesTest`).

Hora e idioma son de Argentina: `config/app.php` fija el huso en
`America/Argentina/Buenos_Aires` y los textos de Laravel salen de `lang/es/`
(`APP_LOCALE=es`).
