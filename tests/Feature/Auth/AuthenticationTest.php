<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('inicio', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('una cuenta dada de baja pierde la sesion abierta', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('inicio'))->assertOk();

    $user->update(['activo' => false]);

    $this->get(route('inicio'))
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('una cuenta dada de baja no entra con recordarme', function () {
    $user = User::factory()->create(['remember_token' => 'token-de-prueba']);
    $recordarme = Auth::guard('web')->getRecallerName();
    $cookie = $user->id.'|token-de-prueba|'.$user->getAuthPassword();

    $this->withCookie($recordarme, $cookie)->get(route('inicio'))->assertOk();

    $user->update(['activo' => false]);
    Auth::forgetGuards();
    $this->flushSession();

    $this->withCookie($recordarme, $cookie)
        ->get(route('inicio'))
        ->assertRedirect(route('login'));
    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
