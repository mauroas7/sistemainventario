# Sistema de Gestión de Bienes Patrimoniales

## El problema

En muchas instituciones, el control de los bienes patrimoniales (equipamiento, mobiliario, herramientas, etc.) se lleva a través de planillas de cálculo, remitos en papel o registros dispersos entre distintas áreas. Esto genera varios problemas recurrentes:

- **Pérdida de trazabilidad**: no se sabe con certeza dónde está un bien, quién lo tiene o cuándo se movió por última vez.
- **Falta de responsables claros**: cuando un bien se traslada de un área a otra sin un registro formal, es difícil determinar quién es responsable en cada momento.
- **Procesos manuales y lentos**: coordinar el envío y la recepción de un bien entre áreas suele depender de comunicaciones informales (llamados, mensajes, papeles) que no quedan documentadas.
- **Dificultad para auditar**: ante una inspección o control patrimonial, reconstruir el historial de movimientos de un bien es una tarea tediosa y propensa a errores.

## La solución

Este sistema busca centralizar y digitalizar la gestión patrimonial de una institución, ofreciendo un flujo claro de **envío y recepción de bienes entre áreas**, con trazabilidad completa de cada movimiento.

Cada bien queda asociado a un área responsable y a una ubicación física actual, y todo traslado se documenta mediante un **ticket de movimiento** que registra:

- Quién envía y quién recibe el bien.
- Área de origen y área de destino.
- Tipo de movimiento y motivo.
- Condición del bien al salir y al ser recibido.
- Fecha de envío y fecha de recepción.
- Estado del movimiento (pendiente, recibido, etc.).

De esta forma, en todo momento es posible saber **dónde está cada bien, quién lo tiene y qué historial de movimientos tuvo**.

## Ventajas

- **Trazabilidad completa**: cada bien cuenta con un historial auditable de todos sus movimientos entre áreas.
- **Responsabilidad clara**: al quedar registrado quién envía y quién recibe, se reduce la ambigüedad sobre quién es responsable del bien en cada momento.
- **Flujo digital de tickets**: reemplaza los remitos en papel y las comunicaciones informales por un proceso estructurado dentro del sistema.
- **Roles y permisos diferenciados**: usuarios, coordinadores y administradores acceden a distintas funcionalidades según su nivel de responsabilidad, lo que ordena el uso del sistema en toda la institución.
- **Panel patrimonial centralizado**: administradores y coordinadores cuentan con un dashboard para visualizar el estado general de los bienes y los movimientos en curso.
- **Base para auditorías y controles**: al contar con datos estructurados y centralizados, generar reportes o responder a un control patrimonial deja de ser un proceso manual.

## Estado del proyecto

Este repositorio es una **prueba de concepto en desarrollo activo**. El objetivo en esta etapa es demostrar la idea y el flujo central del sistema (alta de bienes, envío y recepción mediante tickets, trazabilidad de movimientos), por lo que no todas las funcionalidades están completas ni pulidas todavía. El foco está puesto en validar que la solución propuesta resuelve el problema planteado, más que en la cobertura total de funcionalidades.

## Stack tecnológico

- **Backend**: [PHP](https://www.php.net) + [Laravel](https://laravel.com) (8.2+)
- **Frontend**: [React](https://react.dev) + [Inertia.js](https://inertiajs.com) + [Tailwind CSS](https://tailwindcss.com)
- **Base de datos**: [MySQL](https://www.mysql.com)
- **Build tool**: [Vite](https://vitejs.dev)
- **Desarrollo colaborativo**: [Git](https://git-scm.com) + [GitHub](https://github.com)
- **Despliegue**: [Docker](https://www.docker.com) *(planificado, aún no implementado)*

## Puesta en marcha

```bash
# Instalar dependencias de PHP
composer install

# Instalar dependencias de JavaScript
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Levantar el entorno de desarrollo (servidor, cola, logs y vite)
composer run dev
```

## Equipo de desarrollo

Este proyecto fue desarrollado por:

- **[Gianfranco Godoy]** — [https://www.linkedin.com/in/gianfranco-godoy-3b9808237/]()
- **[Mauro Astudillo]** — [https://www.linkedin.com/in/mauroastudillo/]()
- **[Nombre integrante 3]** — [LinkedIn]()
- **[Nombre integrante 4]** — [LinkedIn]()
- **[Nombre integrante 5]** — [LinkedIn]()
