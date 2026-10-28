<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('inicio', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_una_cuenta_dada_de_baja_pierde_la_sesion_abierta(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->get(route('inicio'))->assertOk();

        $user->update(['activo' => false]);

        $this->get(route('inicio'))
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_una_cuenta_dada_de_baja_no_entra_con_recordarme(): void
    {
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
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
