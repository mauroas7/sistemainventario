# Rol administrador

El rol `admin` de hoy pasa a llamarse `patrimonio` (Gestión de Bienes) y conserva
todo lo que hace, salvo Configuración. Nace un `admin` nuevo, dueño de
Configuración (áreas y usuarios), sin área y sin el control patrimonial.

## Decisiones

- **Slug `patrimonio`, etiqueta «Gestión de Bienes»; `admin` queda con la
  etiqueta «Administrador».** El slug dice qué hace y el admin vuelve a ser lo
  que el nombre promete.
- **Se edita `create_users`, no se agrega migración.** El sistema no está en
  producción (`docs/arquitectura.md`, *Migraciones*); `rol` es un `string(20)`,
  así que la migración sólo cambia si cambia el default (no cambia: sigue
  `usuario`). Una base local con `rol = 'admin'` se rehace con
  `php artisan migrate:fresh --seed` y la demo.
- **Configuración pasa entera a `rol:admin`; Gestión de Bienes la pierde.** Es lo
  que hace al admin «dueño». Las rutas conservan URL y nombre
  (`patrimonio.configuracion.index`, `patrimonio.areas.*`,
  `patrimonio.usuarios.*`) para no tocar cada `route()` del frontend: sólo salen
  a su propio grupo con `rol:admin`.
- **El admin no informa ni recibe movimientos.** Sin área no tiene bienes que
  trasladar ni nada que acusar: `envio.*` y `recepcion.*` pasan a
  `rol:patrimonio,coordinador,usuario`. Inicio le muestra sólo los accesos, como
  hoy a Gestión de Bienes.
- **Gestión de Bienes sigue sin área obligatoria**, como el admin de hoy:
  `area_id` se descarta para `admin` y para `patrimonio`.
- **La guarda del último administrador cuida al admin nuevo**: es quien da de
  alta y de baja. Nada impide dejar a Gestión de Bienes sin nadie; el admin la
  repuebla.
- **Los mails van a Gestión de Bienes**: el fallback de
  `PATRIMONIO_NOTIFICACIONES_EMAIL` pasa de «todos los administradores» a
  «todos los de Gestión de Bienes» (activos). El admin no recibe avisos.
- **`usuarios:crear-administrador` crea el admin nuevo.** En producción el
  primer admin da de alta a Gestión de Bienes desde Configuración.
- **Demo: una cuenta por rol y por área, y el área en el dominio del correo**
  (`coordinador@sistemas.test`, `usuario@sistemas.test`). Se entra sin recordar
  números. Enfermería conserva un segundo usuario (`usuario2@enfermeria.test`)
  para mostrar que un usuario no ve lo de su compañero. Gestión de Bienes es
  `gestor@patrimonio.test`, la cuenta dada de baja `baja@farmacia.test` y el
  admin nuevo `admin@hospital.test` («Admin Test», sin área).

Tres unidades: primero el renombre puro (el sistema hace lo mismo que hoy), después
la demo nueva y al final el rol nuevo. Así cada diff se revisa sin lo otro mezclado.

## U1 — `admin` pasa a `patrimonio`

Estado: hecha

Renombre puro: el caso del enum, cada uso y la demo. El comportamiento no cambia;
Gestión de Bienes conserva Configuración hasta U2.

- `app/Enums/Rol.php`: `Admin` → `Patrimonio`, slug `patrimonio`, etiqueta
  «Gestión de Bienes».
- PHP, cada `Rol::Admin` → `Rol::Patrimonio`: `MovimientoService` (`puedeVer`,
  `consultaBase`, `por_acusar`), `NotificacionMovimientoService` (fallback),
  `TicketController`, `InicioController`, `Patrimonio/UsuarioController`
  (guarda: el mensaje dice «al menos una cuenta de Gestión de Bienes activa»),
  `CrearAdministrador` (crea `Patrimonio` hasta U2), `GuardarUsuarioRequest` y
  `ActualizarUsuarioRequest` (`exclude_if:rol,patrimonio`).
- `routes/web.php`: `rol:admin` → `rol:patrimonio`.
- `config/patrimonio.php`: el comentario del fallback.
- JS, cada `'admin'` → `'patrimonio'`: `data/navegacion.js`,
  `utils/movimientos.js`, `Pages/Inicio/Index.jsx`, `Pages/Recepcion/Show.jsx`,
  `Pages/Envio/Create.jsx`, `Pages/Patrimonio/Configuracion/Index.jsx`,
  `Components/Patrimonio/FormularioUsuario.jsx`,
  `Components/Patrimonio/TablaUsuarios.jsx`.
- `database/seeders/Demo/DemoSeeder.php`: Silvana y Gustavo con
  `Rol::Patrimonio` y correo `gestor1/gestor2.patrimonio@hospital.test`; revisar
  `MovimientosSeeder` por correos o roles escritos a mano.
- Tests: `RolesTest`, `PatrimonioTest`, `DatosInicialesTest`,
  `MovimientosTest`, y cualquier `['rol' => Rol::Admin]`.
- Docs: `README.md` (tabla de usuarios de prueba, «sólo administradores»),
  `docs/arquitectura.md` (tabla de roles, mails), `docs/frontend.md`
  (líneas de rol).

Reglas: `docs/comentarios.md`; antes de tocar `resources/js/`,
`docs/frontend.md`. Al terminar, `grep` de `Rol::Admin` y `'admin'` en `app/`,
`routes/`, `database/`, `resources/js/` y `tests/` sin resultados.

Revisar: con `gestor1.patrimonio@hospital.test`, el menú muestra Control
patrimonial, Localizador, Directorio y Configuración; el tablero, el localizador
y Configuración abren; en Configuración, el rol se llama «Gestión de Bienes» y
elegirlo deshabilita el área.

## U2 — la demo, una cuenta por rol

Estado: hecha

- `database/seeders/Demo/DemoSeeder.php`: `correo()` arma `<puesto>@<área>.test`;
  por área un coordinador y un usuario (`usuario`), más `usuario2@enfermeria.test`
  (Pedro); Patrimonio sólo `gestor@patrimonio.test` (Silvana); la dada de baja,
  `baja@farmacia.test` (Elena).
- `BienesSeeder`: los bienes de los `usuario2` que se van pasan al `usuario` del
  área; `MPM001` sigue con Pedro.
- `MovimientosSeeder`: Pablo pasa a María, Martín a Carlos y Gustavo a Silvana; los
  diez movimientos y sus pasos no cambian.
- Tests: los correos nuevos; la bandeja de María pasa a `[3, 1, 2]` y la de Carlos
  a `[4, 0, 2]`, el resto igual; la guarda de Gestión de Bienes crea al segundo
  gestor con la factory; `DatosInicialesTest` cuenta un usuario por área y dos en
  Enfermería.
- Docs: `README.md` (usuarios de prueba y el ejemplo de Enfermería),
  `docs/arquitectura.md` (*Datos*).

Revisar: `/login` con `gestor@patrimonio.test`, `coordinador@enfermeria.test` y
`usuario@sistemas.test` (clave `demo1234`); `baja@farmacia.test` no entra.

## U3 — el admin nuevo, dueño de Configuración

Estado: pendiente

- `app/Enums/Rol.php`: caso `Admin`, slug `admin`, etiqueta «Administrador».
- `routes/web.php`: Configuración (`configuracion.index`, `areas.*`,
  `usuarios.*`) sale del grupo `rol:patrimonio` a otro grupo `rol:admin` con el
  mismo prefijo y nombre; `envio.*` y `recepcion.*` pasan a
  `rol:patrimonio,coordinador,usuario`.
- `InicioController`: el admin, como Gestión de Bienes, recibe sólo los accesos.
- `Patrimonio/UsuarioController`: la guarda vuelve a «Debe quedar al menos un
  administrador activo» y cuenta `Rol::Admin`; también «no podés quitarte el rol
  de administrador».
- `GuardarUsuarioRequest` / `ActualizarUsuarioRequest`: `area_id` se descarta
  para `admin` y `patrimonio` (`exclude_if` con los dos, o un `Rule::excludeIf`).
- `CrearAdministrador`: crea `Rol::Admin`, sin área.
- JS: `data/navegacion.js` (Configuración sólo `['admin']`; Envío y Recepción sin
  `admin`), `FormularioUsuario.jsx` y `Configuracion/Index.jsx` (el área se
  deshabilita y se borra para los dos roles sin área).
- `DemoSeeder`: `admin@hospital.test`, «Admin Test», `Rol::Admin`, sin área.
- Tests: el admin entra a Configuración y no al tablero, al localizador, al
  directorio, a Envío ni a Recepción (403); Gestión de Bienes no entra a
  Configuración; la guarda cuenta admins, no gestores; el comando crea un admin
  sin área; el aviso sin `PATRIMONIO_NOTIFICACIONES_EMAIL` va a Gestión de
  Bienes y no al admin; `DatosInicialesTest` cuenta el admin de la demo.
- Docs: `README.md` (qué tiene, tabla de usuarios de prueba, Producción: el
  comando crea al admin y éste da de alta a Gestión de Bienes),
  `docs/arquitectura.md` (tabla de roles con la fila nueva, *Autenticación y
  roles*, *Mails*, *Datos*). Último paso: borrar este plan.

Reglas: `docs/comentarios.md`, `docs/frontend.md`; el menú y el `rol:` de las
rutas se revisan juntos (`docs/arquitectura.md`).

Revisar: con `admin@hospital.test`, el menú muestra sólo Inicio, Configuración y
Mi cuenta; `/patrimonio/dashboard`, `/envio/crear-ticket` y `/recepcion/bandeja`
dan 403; puede dar de alta un usuario de cada rol, y el área se pide sólo para
coordinador y usuario. Con `gestor@patrimonio.test`, Configuración ya no está en el
menú y su URL da 403. Darse de baja o quitarse el rol siendo el único admin
muestra el error.
