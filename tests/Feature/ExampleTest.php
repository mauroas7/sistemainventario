<?php

/**
 * La raíz no renderiza nada: deriva al login si no hay sesión y al inicio si la hay.
 */
test('la raiz redirige al login cuando no hay sesion', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});
