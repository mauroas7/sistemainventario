<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * La raíz no renderiza nada: deriva al login si no hay sesión y al inicio si la hay.
     */
    public function test_la_raiz_redirige_al_login_cuando_no_hay_sesion(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('login'));
    }
}
