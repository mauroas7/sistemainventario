<?php

use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoBien;
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
        ->has('bienes.data', Bien::count())
        ->where('bienes.total', Bien::count()));

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

test('el csv sale con las columnas de la planilla de patrimonio, en su orden', function () {
    $bien = informarTraslado()->bien;

    $respuesta = $this->actingAs($this->patrimonio)->get(route('patrimonio.dashboard.exportar'));
    $renglones = array_map(
        fn (string $renglon) => str_getcsv($renglon, ';'),
        explode("\n", trim(substr($respuesta->streamedContent(), 3))),
    );

    expect(array_slice($renglones[0], 0, 9))->toBe([
        'N° Inventario', 'N° Sistema', 'Ubicación actual', 'Responsable actual',
        'Descripción del bien', 'Detalle del bien', 'Nueva ubicación', 'Nuevo responsable',
        'Motivo del traslado',
    ]);
    expect(array_slice($renglones[1], 0, 7))->toBe([
        'NB001', $bien->numero_diaguita, 'Sistemas', 'Juan Pérez',
        'Notebook Dell Latitude 5420', 'Notebook utilizada por Sistemas.', 'Laboratorio',
    ]);
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
        ->assertRedirect(route('login'));

    expect($this->patrimonio->fresh()->tieneRol('admin'))->toBeTrue();
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

/** Los datos de un bien nuevo en Enfermería; `$extra` pisa cualquiera. */
function datosDeBien(array $extra = []): array
{
    return [
        'codigo' => 'INV-9001',
        'numero_diaguita' => 'DG-9001',
        'nombre' => 'Monitor multiparamétrico',
        'area_id' => Area::where('nombre', 'Enfermería')->value('id'),
        'estado_id' => EstadoBien::where('nombre', 'En uso')->value('id'),
        ...$extra,
    ];
}

test('patrimonio da de alta un bien en su área y a cargo de alguien de esa área', function () {
    $laura = User::where('email', 'laura@hospital.test')->firstOrFail(); // Enfermería

    $this->actingAs($this->patrimonio)
        ->post(route('patrimonio.bienes.store'), datosDeBien(['responsable_id' => $laura->id]))
        ->assertSessionHasNoErrors();

    $bien = Bien::where('codigo', 'INV-9001')->firstOrFail();

    expect($bien->area_id)->toBe($laura->area_id)
        ->and($bien->ubicacion_actual_id)->toBe($laura->area_id)
        ->and($bien->responsable_id)->toBe($laura->id);

    $this->post(route('patrimonio.bienes.store'), datosDeBien(['responsable_id' => $this->juan->id]))
        ->assertSessionHasErrors(['codigo', 'numero_diaguita']);

    $this->post(route('patrimonio.bienes.store'), datosDeBien(['codigo' => 'INV-9002', 'numero_diaguita' => null, 'responsable_id' => $this->juan->id]))
        ->assertSessionHasErrors('responsable_id');
});

test('un bien sin movimientos se edita entero y uno con movimientos no cambia de área ni de responsable', function () {
    $farmacia = Area::where('nombre', 'Farmacia')->value('id');
    $sinMovimientos = Bien::where('codigo', '!=', 'NB001')->firstOrFail();

    $this->actingAs($this->patrimonio)
        ->put(route('patrimonio.bienes.update', $sinMovimientos), datosDeBien(['codigo' => $sinMovimientos->codigo, 'area_id' => $farmacia]))
        ->assertSessionHasNoErrors();

    expect($sinMovimientos->fresh())
        ->area_id->toBe($farmacia)
        ->ubicacion_actual_id->toBe($farmacia)
        ->nombre->toBe('Monitor multiparamétrico');

    $carlos = User::where('email', 'carlos@hospital.test')->firstOrFail(); // Laboratorio
    $movido = informarTraslado(['responsable_nuevo_id' => $carlos->id])->bien;
    $laboratorio = $movido->area_id;

    $this->actingAs($this->patrimonio)
        ->put(route('patrimonio.bienes.update', $movido), datosDeBien([
            'codigo' => $movido->codigo,
            'numero_diaguita' => 'DG-9002',
            'area_id' => $farmacia,
            'responsable_id' => null,
        ]))
        ->assertSessionHasNoErrors();

    expect($movido->fresh())
        ->area_id->toBe($laboratorio)
        ->ubicacion_actual_id->toBe($laboratorio)
        ->responsable_id->toBe($carlos->id)
        ->numero_diaguita->toBe('DG-9002');
});

test('patrimonio da de alta y renombra un área sin repetir nombres', function () {
    $this->actingAs($this->patrimonio)
        ->post(route('patrimonio.areas.store'), ['nombre' => 'Kinesiología'])
        ->assertSessionHasNoErrors();

    $area = Area::where('nombre', 'Kinesiología')->firstOrFail();

    $this->put(route('patrimonio.areas.update', $area), ['nombre' => 'Farmacia'])->assertSessionHasErrors('nombre');
    $this->put(route('patrimonio.areas.update', $area), ['nombre' => 'Kinesiología y Fisiatría'])->assertSessionHasNoErrors();

    expect($area->fresh()->nombre)->toBe('Kinesiología y Fisiatría');
});

test('sólo patrimonio da de alta bienes y áreas', function () {
    $this->actingAs($this->juan);

    $this->post(route('patrimonio.bienes.store'), datosDeBien())->assertForbidden();
    $this->put(route('patrimonio.bienes.update', Bien::firstOrFail()), datosDeBien())->assertForbidden();
    $this->post(route('patrimonio.areas.store'), ['nombre' => 'Kinesiología'])->assertForbidden();
    $this->put(route('patrimonio.areas.update', Area::firstOrFail()), ['nombre' => 'Otra'])->assertForbidden();
});

test('el directorio de bienes se pagina de a 20', function () {
    foreach (range(1, 25) as $numero) {
        Bien::create([...datosDeBien(['codigo' => "INV-{$numero}", 'numero_diaguita' => null]), 'ubicacion_actual_id' => datosDeBien()['area_id']]);
    }

    $total = Bien::count();

    $this->actingAs($this->patrimonio);

    $this->get(route('patrimonio.bienes.index'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 20)
        ->where('bienes.total', $total));

    $this->get(route('patrimonio.bienes.index', ['page' => 2]))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', $total - 20)
        ->where('bienes.current_page', 2));
});

test('el localizador busca en el servidor y trae el último movimiento de cada bien', function () {
    $primero = informarTraslado(); // NB001: Sistemas → Laboratorio
    $carlos = User::where('email', 'carlos@hospital.test')->firstOrFail(); // Laboratorio

    $this->actingAs($carlos)->post(route('envio.store'), [
        'bien_id' => $primero->bien_id,
        'area_origen_id' => $primero->area_destino_id,
        'area_destino_id' => $primero->area_origen_id,
        'tipo_movimiento_id' => TipoMovimiento::orderBy('id')->value('id'),
        'motivo_id' => Motivo::orderBy('id')->value('id'),
    ])->assertSessionHasNoErrors();
    $segundo = Movimiento::latest('id')->firstOrFail();

    $this->actingAs($this->patrimonio);

    $this->get(route('patrimonio.localizador.index', ['busqueda' => 'nb001']))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 1)
        ->where('bienes.data.0.codigo', 'NB001')
        ->where("ultimosMovimientos.{$primero->bien_id}.id", $segundo->id));

    $this->get(route('patrimonio.localizador.index', ['busqueda' => 'no-existe']))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 0)
        ->where('busqueda', 'no-existe'));

    foreach (range(1, 5) as $numero) {
        Bien::create([...datosDeBien(['codigo' => "INV-{$numero}", 'numero_diaguita' => null]), 'ubicacion_actual_id' => datosDeBien()['area_id']]);
    }

    $this->get(route('patrimonio.localizador.index'))->assertInertia(fn (AssertableInertia $pagina) => $pagina
        ->has('bienes.data', 10)
        ->where('bienes.total', Bien::count()));
});
