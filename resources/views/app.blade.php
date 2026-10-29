<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="{{ asset('img/favicon_color.png') }}" type="image/png">

    <title inertia>Bienes HU</title>

    {{-- Montserrat y Material Symbols viajan en el bundle: ver resources/css/app.css. --}}

    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body class="min-h-full bg-canvas font-sans text-brandText antialiased transition-colors duration-300 dark:bg-canvas-dark dark:text-brandText-dark">
    @inertia
</body>
</html>
