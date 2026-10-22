<?php

return [
    /*
     * El proxy que hace el HTTPS (`TRUSTED_PROXIES`, separados por coma; acepta
     * rangos como 172.18.0.0/16). Sólo de él se creen `X-Forwarded-*`: el
     * esquema, el host y la IP del cliente, que es la que cuentan los límites
     * de intentos. Vacío, no se confía en ninguno, como en desarrollo.
     */
    'proxies' => env('TRUSTED_PROXIES') ?: null,
];
