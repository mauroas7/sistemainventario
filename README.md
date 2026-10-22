# Bienes HU

Gestión de los bienes patrimoniales del Hospital Universitario: cada área consulta
sus bienes e informa sus traslados, y Gestión de Bienes (Patrimonio) los vuelca a
Diaguita y hace firmar la ficha de inventario.

Laravel 12 · PHP 8.2 · React 18 + Inertia 2 · Vite 7 + Tailwind 3.

---

## Qué tiene

- **Envío**: cualquier usuario informa el traslado de un bien de su área, con una
  foto opcional. El traslado es efectivo en el acto y sale un aviso por mail a
  Patrimonio, a quien lo informó y al responsable saliente.
- **Recepción**: la bandeja de los movimientos que salen del área o llegan a ella,
  con el acuse de recibo y la anulación.
- **Control patrimonial** (sólo administradores): el tablero de movimientos con
  filtros, cambio de estado y exportación a CSV; el localizador, el directorio de
  bienes y la configuración de usuarios.
- Una suite de tests (Pest): `php artisan test`.

---

## Puesta en marcha

### 1. Requisitos

- **PHP 8.2 o superior** y Composer.
- **Node 20.19 o superior** (o 22.12 o superior): Vite 7 no compila con un Node
  20 anterior. Lo declara `engines` en `package.json`.
- **git**: `npm install` baja [`hu-kit`](https://github.com/mauroas7/hu-kit), el
  repo público con la marca que comparten los sistemas del hospital. Qué trae, en
  [`docs/frontend.md`](docs/frontend.md#marca).

### 2. Instalación

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install && npm run build
```

Los dos últimos pasos no son opcionales: sin `APP_KEY` **todas** las rutas
responden 500 con un error del encriptador, y sin los assets compilados revienta
toda pantalla. Los dos fallos parecen errores de código y no lo son.

### 3. Base de datos

Usa **MySQL** (Laragon la deja lista; si no, configurá `DB_*` en `.env`):

```bash
php artisan migrate --seed
```

Eso crea el esquema y siembra sólo **`Catalogos/`, los datos reales**: los estados
de movimiento que el sistema necesita para funcionar y las listas de estados de
bien, tipos de movimiento y motivos. Es lo mismo en todos los entornos, producción
incluida.

**La demo** (`Demo/`) se siembra aparte y a mano: las áreas, los usuarios de prueba
y unos bienes. En producción se niega a correr.

```bash
php artisan db:seed --class="Database\Seeders\Demo\DemoSeeder"
```

### Producción

La base de producción nace vacía: no se copia de ninguna otra.

```bash
php artisan migrate --seed --force                                  # el esquema y sólo Catalogos/
php artisan usuarios:crear-administrador patrimonio@hospital.edu.ar # el primer admin
```

El comando pide nombre y contraseña. Desde ahí, el administrador da de alta al
resto de los usuarios desde Configuración.

**Áreas y bienes no tienen alta desde la aplicación**: la demo los inventa, y en
producción hoy hay que cargarlos directo en la base (`areas` y `bienes`). Sin
áreas no se puede dar de alta a nadie que no sea administrador.

- En producción `migrate:fresh`, `migrate:rollback` y `db:wipe` no corren, y la
  demo tampoco aunque se la pida a mano.
- El `.env` de producción cambia, respecto de `.env.example`, lo que sigue. Un
  faltante no avisa: con `MAIL_MAILER=log` los avisos terminan en
  `storage/logs/laravel.log`.
  - `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` con la dirección real y
    `APP_KEY` generada (`php artisan key:generate`).
  - `DB_*` de la base del servidor.
  - `MAIL_MAILER=smtp` y el relay del hospital (el comentario en `.env.example`),
    `MAIL_FROM_ADDRESS` con una casilla institucional y
    `PATRIMONIO_NOTIFICACIONES_EMAIL` con las casillas de Gestión de Bienes.
  - `TRUSTED_PROXIES` con el proxy del HTTPS y `SESSION_SECURE_COOKIE=true`.
- Las fotos de los movimientos quedan en `storage/app/private/movimientos/`, fuera
  de `public/`: esa carpeta tiene que sobrevivir a cada despliegue.

### 4. Levantarlo

```bash
composer run dev
```

Arranca el servidor y Vite juntos; no hay cola, los mails salen en el momento. O
por separado:

```bash
php artisan serve      # http://127.0.0.1:8000
npm run dev
```

Antes de dar algo por terminado: `php artisan test` y `./vendor/bin/pint`.

---

## Usuarios de prueba

Existen sólo con la demo sembrada. Todos usan la contraseña **`password`**.

| correo                     | rol           | área           |
| -------------------------- | ------------- | -------------- |
| `patrimonio@hospital.test` | Administrador | Patrimonio     |
| `admin@hospital.test`      | Administrador | Dirección      |
| `juan@hospital.test`       | Coordinador   | Sistemas       |
| `ana@hospital.test`        | Usuario       | Enfermería     |
| `carlos@hospital.test`     | Usuario       | Laboratorio    |
| `maria@hospital.test`      | Usuario       | Administración |

---

## Problemas frecuentes

**Todas las rutas responden 500 con un error del encriptador.**
Falta `APP_KEY`: corré `php artisan key:generate`.

**Toda pantalla revienta con un error del manifest de Vite.**
Faltan los assets: corré `npm install && npm run build`.

**Todas las páginas se ven sin estilos.**
Quedó un `public/hot` viejo de un Vite cortado de golpe: la app apunta los assets
a un servidor de desarrollo que no está corriendo. Borralo o volvé a levantar
`npm run dev`.

**`npm install` falla al bajar `hu-kit`.**
Falta git en la máquina, o no tiene salida a GitHub.

---

## Cómo se trabaja con git

- **`main` es lo que está en producción; `test`, lo integrado y probado.** No se
  trabaja directo sobre ninguna de las dos.
- **Una rama por tarea**, que sale de `test` actualizada y vuelve a `test` con un
  merge cuando pasan `php artisan test` y `./vendor/bin/pint`. Después del merge
  se borra, en la máquina y en GitHub.
- **A `main` sólo entra `test`**, entera y por fast-forward, cuando se publica una
  versión, y esa versión lleva su tag (`v1.0.0`, `v1.1.0`…).
- **El mensaje de commit es una línea en castellano**, con el tipo adelante
  (`feat:`, `fix:`, `docs:`, `refactor:`) y el resultado, no la tarea.
- **Un cambio que deja mal un documento de `docs/` lo corrige en el mismo commit.**

---

## Cómo está armado

El código, los comentarios y los nombres de dominio están en español. La
documentación técnica está en `docs/`:

- **[`docs/arquitectura.md`](docs/arquitectura.md)**: capas, roles, el circuito de
  un movimiento, mails, fotos, datos y tests.
- **[`docs/frontend.md`](docs/frontend.md)**: React + Inertia, marca, formularios y
  datos. Leelo antes de tocar `resources/js/`.
- **[`docs/comentarios.md`](docs/comentarios.md)**: la regla de comentarios, que
  verifica un test.
