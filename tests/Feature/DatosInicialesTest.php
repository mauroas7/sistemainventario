<?php

use App\Enums\Rol;
use App\Models\EstadoMovimiento;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\Demo\DemoSeeder;

test('la siembra de todos los entornos no crea usuarios', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $this->assertSame(0, User::count());
    $this->assertSame(4, EstadoMovimiento::count());
});

test('la demo no corre en produccion', function () {
    $this->app['env'] = 'production';

    $this->expectException(RuntimeException::class);

    $this->app->make(DemoSeeder::class)->setContainer($this->app)->__invoke();
});

test('crea el primer administrador desde la consola', function () {
    $this->artisan('usuarios:crear-administrador', ['email' => 'silvana@hospital.test'])
        ->expectsQuestion('Nombre y apellido', 'Silvana Gómez')
        ->expectsQuestion('Contraseña (mínimo 8 caracteres)', 'una-clave-larga')
        ->assertSuccessful();

    $usuario = User::where('email', 'silvana@hospital.test')->firstOrFail();

    $this->assertSame(Rol::Admin, $usuario->rol);
    $this->assertTrue($usuario->activo);
});

test('no crea un administrador con un correo ya usado', function () {
    User::factory()->create(['email' => 'silvana@hospital.test']);

    $this->artisan('usuarios:crear-administrador', ['email' => 'silvana@hospital.test'])
        ->expectsQuestion('Nombre y apellido', 'Silvana Gómez')
        ->expectsQuestion('Contraseña (mínimo 8 caracteres)', 'una-clave-larga')
        ->assertFailed();

    $this->assertSame(1, User::count());
});

test('dar de baja una cuenta conserva la fecha original', function () {
    $usuario = User::factory()->create();

    $usuario->update(['activo' => false]);
    $fecha = $usuario->fresh()->fecha_baja;

    $this->travel(2)->days();
    $usuario->fresh()->update(['activo' => false]);

    $this->assertFalse($usuario->fresh()->activo);
    $this->assertTrue($fecha->equalTo($usuario->fresh()->fecha_baja));
    $this->assertSame(0, User::activos()->count());
});
