<?php

use App\Models\Area;
use App\Models\Bien;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\Demo\DemoSeeder;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->seed([DatabaseSeeder::class, DemoSeeder::class]);

    $this->enfermeria = Area::where('nombre', 'Enfermería')->firstOrFail();
});

test('el coordinador y el usuario ven todos los bienes de su área y ninguno de otra', function () {
    $codigos = Bien::where('area_id', $this->enfermeria->id)->orderBy('codigo')->pluck('codigo')->all();

    foreach (['coordinador.enfermeria@hospital.test', 'usuario2.enfermeria@hospital.test'] as $email) {
        $this->actingAs(User::where('email', $email)->firstOrFail())
            ->get(route('mis-bienes'))
            ->assertInertia(fn (AssertableInertia $pagina) => $pagina
                ->component('MisBienes/Index')
                ->where('bienes.total', count($codigos))
                ->where('bienes.data', fn ($bienes) => collect($bienes)->pluck('codigo')->all() === $codigos));
    }
});

test('mis bienes busca sólo dentro del área', function () {
    $this->actingAs(User::where('email', 'coordinador.enfermeria@hospital.test')->firstOrFail());

    $this->get(route('mis-bienes', ['busqueda' => 'tab001']))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 1)
        ->where('bienes.data.0.codigo', 'TAB001')
        ->where('busqueda', 'tab001'));

    // NB001 es de Sistemas.
    $this->get(route('mis-bienes', ['busqueda' => 'nb001']))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 0));
});

test('patrimonio no entra a mis bienes: tiene el directorio', function () {
    $this->actingAs(User::where('email', 'admin1.patrimonio@hospital.test')->firstOrFail())
        ->get(route('mis-bienes'))
        ->assertForbidden();
});
