<?php

use App\Enums\Rol;
use App\Models\Area;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('el rol se resuelve por slug, por etiqueta o por el enum', function () {
    expect(Rol::desde('coordinador'))->toBe(Rol::Coordinador)
        ->and(Rol::desde('Coordinador / Jefe de área'))->toBe(Rol::Coordinador)
        ->and(Rol::desde(Rol::Admin))->toBe(Rol::Admin)
        ->and(Rol::desde('jefe'))->toBeNull();
});

test('un usuario tiene solo los roles que le tocan', function () {
    $coordinador = User::factory()->create(['rol' => Rol::Coordinador]);

    expect($coordinador->tieneRol('coordinador'))->toBeTrue()
        ->and($coordinador->tieneRol(Rol::Admin, Rol::Usuario))->toBeFalse();
});

test('la ruta rol:admin deja pasar solo al admin', function () {
    $this->actingAs(User::factory()->create(['rol' => Rol::Usuario]))
        ->get(route('patrimonio.dashboard'))
        ->assertForbidden();

    $this->actingAs(User::factory()->create(['rol' => Rol::Admin]))
        ->get(route('patrimonio.dashboard'))
        ->assertOk();
});

test('la pantalla recibe el usuario armado, sin el modelo entero', function () {
    $area = Area::create(['nombre' => 'Sistemas']);
    $usuario = User::factory()->create(['rol' => Rol::Coordinador, 'area_id' => $area->id]);

    $this->actingAs($usuario)
        ->get(route('inicio'))
        ->assertInertia(fn (AssertableInertia $pagina) => $pagina
            ->where('auth.usuario', [
                'id' => $usuario->id,
                'nombre' => $usuario->name,
                'email' => $usuario->email,
                'rol' => 'coordinador',
                'rolEtiqueta' => 'Coordinador / Jefe de área',
                'area' => ['id' => $area->id, 'nombre' => 'Sistemas'],
            ]));
});
