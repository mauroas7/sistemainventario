<?php

use App\Models\Area;
use App\Models\Bien;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\Demo\DemoSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->seed([DatabaseSeeder::class, DemoSeeder::class]);

    $this->patrimonio = User::where('email', 'patrimonio@hospital.test')->firstOrFail();
    $this->juan = User::where('email', 'juan@hospital.test')->firstOrFail(); // Sistemas
});

/** Informa el traslado de NB001 (Sistemas) a Laboratorio, como Juan. */
function informarTraslado(array $extra = []): Movimiento
{
    $bien = Bien::where('codigo', 'NB001')->firstOrFail();

    test()->actingAs(test()->juan)->post(route('envio.store'), [
        'bien_id' => $bien->id,
        'area_origen_id' => $bien->area_id,
        'area_destino_id' => Area::where('nombre', 'Laboratorio')->value('id'),
        'tipo_movimiento_id' => TipoMovimiento::orderBy('id')->value('id'),
        'motivo_id' => Motivo::orderBy('id')->value('id'),
        ...$extra,
    ])->assertSessionHasNoErrors();

    return Movimiento::latest('id')->firstOrFail();
}

test('las pantallas de patrimonio llegan con sus datos y sin api', function () {
    $movimiento = informarTraslado();
    $bien = $movimiento->bien;

    $this->actingAs($this->patrimonio);

    $this->get(route('patrimonio.dashboard'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Dashboard')
        ->has('movimientos.data', 1)
        ->where('movimientos.total', 1)
        ->where('resumen.informados', 1)
        ->has('estados', 4));

    $this->get(route('patrimonio.bienes.index'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Bienes/Index')
        ->has('bienes', Bien::count()));

    $this->get(route('patrimonio.bienes.show', $bien))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Bienes/Show')
        ->where('bien.codigo', 'NB001')
        ->has('movimientos', 1));

    $this->get(route('patrimonio.localizador.index'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Localizador/Index')
        ->where("ultimosMovimientos.{$bien->id}.id", $movimiento->id));

    $this->get(route('patrimonio.movimientos.show', $movimiento))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Movimientos/Show')
        ->where('movimiento.id', $movimiento->id)
        ->has('movimiento.historial_estados', 1));

    $this->get(route('patrimonio.configuracion.index'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->component('Patrimonio/Configuracion/Index')
        ->has('usuarios', User::count())
        ->has('areas', Area::count()));

    $this->get('/api/bien')->assertNotFound();
});

test('el dashboard filtra en el servidor', function () {
    informarTraslado();

    $this->actingAs($this->patrimonio)
        ->get(route('patrimonio.dashboard', ['bien' => 'no-existe']))
        ->assertInertia(fn (AssertableInertia $pagina) => $pagina
            ->has('movimientos.data', 0)
            ->where('filtros.bien', 'no-existe'));
});

test('un coordinador no entra a ninguna pantalla de patrimonio', function () {
    $movimiento = informarTraslado();

    $this->actingAs($this->juan);

    foreach ([
        route('patrimonio.dashboard'),
        route('patrimonio.bienes.index'),
        route('patrimonio.bienes.show', $movimiento->bien),
        route('patrimonio.localizador.index'),
        route('patrimonio.movimientos.show', $movimiento),
        route('patrimonio.configuracion.index'),
    ] as $url) {
        $this->get($url)->assertForbidden();
    }
});

test('patrimonio da de alta y de baja una cuenta', function () {
    $this->actingAs($this->patrimonio)
        ->post(route('patrimonio.usuarios.store'), [
            'name' => 'Rosa Díaz',
            'email' => 'rosa@hospital.test',
            'password' => 'una-clave-larga',
            'rol' => 'coordinador',
            'area_id' => Area::where('nombre', 'Farmacia')->value('id'),
        ])
        ->assertSessionHasNoErrors();

    $rosa = User::where('email', 'rosa@hospital.test')->firstOrFail();

    $this->put(route('patrimonio.usuarios.update', $rosa), ['activo' => false])
        ->assertSessionHasNoErrors();

    expect($rosa->fresh()->activo)->toBeFalse();
});

test('nadie se da de baja a sí mismo ni deja el sistema sin administrador', function () {
    $this->actingAs($this->patrimonio)
        ->put(route('patrimonio.usuarios.update', $this->patrimonio), ['activo' => false])
        ->assertSessionHasErrors('general');

    $otroAdmin = User::where('email', 'admin@hospital.test')->firstOrFail();
    $this->put(route('patrimonio.usuarios.update', $otroAdmin), ['activo' => false])->assertSessionHasNoErrors();

    $this->actingAs($otroAdmin->fresh())
        ->put(route('patrimonio.usuarios.update', $this->patrimonio), ['rol' => 'coordinador', 'area_id' => Area::value('id')])
        ->assertSessionHasErrors('general');
});

test('la foto del movimiento es privada y la ve sólo quien puede ver el movimiento', function () {
    Storage::fake('local');

    $movimiento = informarTraslado(['imagen' => UploadedFile::fake()->image('bien.jpg')]);

    Storage::disk('local')->assertExists($movimiento->imagen_salida);

    $this->actingAs($this->juan)
        ->get(route('recepcion.movimientos.foto', $movimiento))
        ->assertOk();

    $this->actingAs(User::where('email', 'ana@hospital.test')->firstOrFail()) // Enfermería
        ->get(route('recepcion.movimientos.foto', $movimiento))
        ->assertForbidden();
});

test('un movimiento anulado no admite acuse de recibo', function () {
    $movimiento = informarTraslado();

    $this->actingAs($this->juan)->post(route('recepcion.anular', $movimiento))->assertSessionHasNoErrors();

    $this->actingAs($this->patrimonio)
        ->post(route('recepcion.confirmar', $movimiento))
        ->assertSessionHasErrors('movimiento');
});
