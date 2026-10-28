<?php

use App\Models\Area;
use App\Models\Bien;
use App\Models\EstadoMovimiento;
use App\Models\Motivo;
use App\Models\Movimiento;
use App\Models\TipoMovimiento;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\Demo\DemoSeeder;
use Database\Seeders\Demo\MovimientosSeeder;

/**
 * Cubre el circuito de movimientos de bienes: quién puede informarlos, qué le pasa al
 * bien cuando se informa uno y cómo queda todo si después se anula.
 */
beforeEach(function () {
    $this->seed([DatabaseSeeder::class, DemoSeeder::class]);
});

function usuarioPorCorreo(string $email): User
{
    return User::where('email', $email)->firstOrFail();
}

function bienPorCodigo(string $codigo): Bien
{
    return Bien::where('codigo', $codigo)->firstOrFail();
}

function areaPorNombre(string $nombre): Area
{
    return Area::where('nombre', $nombre)->firstOrFail();
}

/**
 * Datos mínimos válidos para informar el traslado de un bien.
 */
function datosDeMovimiento(Bien $bien, Area $destino, ?User $responsable = null): array
{
    return array_filter([
        'bien_id' => $bien->id,
        'area_origen_id' => $bien->area_id,
        'area_destino_id' => $destino->id,
        'tipo_movimiento_id' => TipoMovimiento::orderBy('id')->value('id'),
        'motivo_id' => Motivo::orderBy('id')->value('id'),
        'responsable_nuevo_id' => $responsable?->id,
    ]);
}

test('informar un movimiento mueve el bien y cambia su responsable', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');      // Sistemas
    $carlos = usuarioPorCorreo('carlos@hospital.test');  // Laboratorio
    $bien = bienPorCodigo('NB001');                      // está en Sistemas
    $laboratorio = areaPorNombre('Laboratorio');

    $this->actingAs($juan)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $laboratorio, $carlos))
        ->assertRedirect(route('recepcion.bandeja'));

    $bien->refresh();

    $this->assertSame($laboratorio->id, $bien->area_id, 'El bien debería quedar en el área de destino.');
    $this->assertSame($laboratorio->id, $bien->ubicacion_actual_id);
    $this->assertSame($carlos->id, $bien->responsable_id, 'El bien debería quedar a cargo del nuevo responsable.');

    $movimiento = Movimiento::where('bien_id', $bien->id)->firstOrFail();

    $this->assertSame('Informado', $movimiento->estadoMovimiento->nombre);
    $this->assertSame($juan->id, $movimiento->creado_por);
    // El responsable saliente queda registrado para poder reconstruir la cadena.
    $this->assertSame($juan->id, $movimiento->responsable_anterior_id);
});

test('un movimiento sin responsable deja el bien sin persona a cargo', function () {
    // Es un caso válido: quien informa no siempre sabe quién lo va a recibir, y
    // Patrimonio define el responsable después. Lo que no puede pasar es que el bien
    // siga figurando a cargo de quien ya no lo tiene.
    $juan = usuarioPorCorreo('juan@hospital.test');
    $bien = bienPorCodigo('NB001');
    $mantenimiento = areaPorNombre('Mantenimiento');

    $this->actingAs($juan)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $mantenimiento))
        ->assertRedirect();

    $bien->refresh();

    $this->assertSame($mantenimiento->id, $bien->area_id);
    $this->assertNull($bien->responsable_id, 'El bien no puede seguir a cargo del responsable anterior.');
});

test('un usuario no puede informar movimientos de bienes de otra area', function () {
    $carlos = usuarioPorCorreo('carlos@hospital.test'); // Laboratorio
    $bien = bienPorCodigo('NB001');                     // está en Sistemas
    $farmacia = areaPorNombre('Farmacia');

    $this->actingAs($carlos)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $farmacia))
        ->assertForbidden();

    $this->assertSame(0, Movimiento::count(), 'No debería haberse registrado ningún movimiento.');
});

test('el destino no puede ser la misma area de origen', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');
    $bien = bienPorCodigo('NB001');
    $sistemas = areaPorNombre('Sistemas');

    $this->actingAs($juan)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $sistemas))
        ->assertSessionHasErrors('area_destino_id');

    $this->assertSame(0, Movimiento::count());
});

test('el responsable nuevo debe pertenecer al area de destino', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');
    $ana = usuarioPorCorreo('ana@hospital.test'); // Enfermería, no Laboratorio
    $bien = bienPorCodigo('NB001');
    $laboratorio = areaPorNombre('Laboratorio');

    $this->actingAs($juan)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $laboratorio, $ana))
        ->assertSessionHasErrors('responsable_nuevo_id');

    $this->assertSame(0, Movimiento::count());
});

test('anular un movimiento devuelve el bien a donde estaba', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');
    $carlos = usuarioPorCorreo('carlos@hospital.test');
    $bien = bienPorCodigo('NB001');
    $sistemas = areaPorNombre('Sistemas');
    $laboratorio = areaPorNombre('Laboratorio');

    $this->actingAs($juan)
        ->post('/envio/crear-ticket', datosDeMovimiento($bien, $laboratorio, $carlos));

    $movimiento = Movimiento::where('bien_id', $bien->id)->firstOrFail();
    $this->assertSame($laboratorio->id, $bien->refresh()->area_id);

    // Lo anula quien lo informó.
    $this->actingAs($juan)
        ->post("/recepcion/movimientos/{$movimiento->id}/anular")
        ->assertRedirect();

    $bien->refresh();
    $movimiento->refresh();

    $this->assertSame('Anulado', $movimiento->estadoMovimiento->nombre);
    $this->assertSame($sistemas->id, $bien->area_id, 'Al anular, el bien vuelve a su área anterior.');
    $this->assertSame($juan->id, $bien->responsable_id, 'Y vuelve a estar a cargo de quien lo tenía.');
});

test('la bandeja solo muestra los movimientos del area del usuario', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');    // Sistemas
    $maria = usuarioPorCorreo('maria@hospital.test');  // Administración

    // Movimiento entre Sistemas y Laboratorio: no toca a Administración.
    $this->actingAs($juan)->post('/envio/crear-ticket', datosDeMovimiento(
        bienPorCodigo('NB001'),
        areaPorNombre('Laboratorio')
    ));

    $this->assertSame(1, Movimiento::count());

    // María no tiene nada que ver con ese movimiento.
    $this->actingAs($maria)
        ->get('/recepcion/bandeja')
        ->assertInertia(fn ($page) => $page
            ->component('Recepcion/Index')
            ->has('movimientos.data', 0));

    // Juan sí, porque salió de su área.
    $this->actingAs($juan)
        ->get('/recepcion/bandeja')
        ->assertInertia(fn ($page) => $page
            ->component('Recepcion/Index')
            ->has('movimientos.data', 1));
});

test('cada rol ve en la bandeja lo que le toca', function () {
    $this->seed(MovimientosSeeder::class);

    $esperados = [
        'patrimonio' => 5, // todo el hospital
        'laura' => 4,      // coordinadora: todo lo que sale de Enfermería o llega
        'juan' => 2,       // coordinador: la tablet que llegó y la notebook que salió
        'ana' => 2,        // la tablet que informó y el electrocardiógrafo a su cargo
        'pedro' => 1,      // el monitor a su cargo
        'carlos' => 2,     // el electrocardiógrafo que informó y la impresora anulada
        'maria' => 2,      // los dos que informó
    ];

    foreach ($esperados as $nombre => $cantidad) {
        $this->actingAs(usuarioPorCorreo("{$nombre}@hospital.test"))
            ->get('/recepcion/bandeja?estado=todos')
            ->assertInertia(fn ($page) => $page
                ->where('movimientos.total', $cantidad)
                ->where('resumen.total', $cantidad));
    }
});

test('un usuario no ve ni acusa lo de su area que no es suyo', function () {
    $this->seed(MovimientosSeeder::class);

    // Carlos mandó el electrocardiógrafo a Enfermería, a cargo de Ana.
    $movimiento = Movimiento::whereHas('bien', fn ($q) => $q->where('codigo', 'ECG001'))->firstOrFail();

    $pedro = usuarioPorCorreo('pedro@hospital.test'); // Usuario de Enfermería
    $this->actingAs($pedro)->get("/recepcion/movimientos/{$movimiento->id}")->assertForbidden();
    $this->actingAs($pedro)->post("/recepcion/movimientos/{$movimiento->id}/confirmar")->assertForbidden();

    $this->actingAs(usuarioPorCorreo('ana@hospital.test'))->get("/recepcion/movimientos/{$movimiento->id}")->assertOk();

    $laura = usuarioPorCorreo('laura@hospital.test'); // coordinadora de Enfermería
    $this->actingAs($laura)->post("/recepcion/movimientos/{$movimiento->id}/confirmar")->assertSessionHasNoErrors();
    $this->assertSame($laura->id, $movimiento->fresh()->recibido_por);
});

test('cada cambio de estado queda registrado con su autor', function () {
    $juan = usuarioPorCorreo('juan@hospital.test');
    $patrimonio = usuarioPorCorreo('patrimonio@hospital.test'); // admin
    $bien = bienPorCodigo('NB001');

    $this->actingAs($juan)->post('/envio/crear-ticket', datosDeMovimiento(
        $bien,
        areaPorNombre('Laboratorio')
    ));

    $movimiento = Movimiento::firstOrFail();

    // El alta ya deja su propia entrada, sin estado anterior.
    $alta = $movimiento->historialEstados()->first();
    $this->assertNotNull($alta);
    $this->assertNull($alta->estado_anterior_id);
    $this->assertSame('Informado', $alta->estadoNuevo->nombre);
    $this->assertSame($juan->id, $alta->usuario_id);

    // Patrimonio lo marca como registrado en Diaguita.
    $registrado = EstadoMovimiento::where('nombre', 'Registrado')->firstOrFail();

    $this->actingAs($patrimonio)
        ->patch("/patrimonio/movimientos/{$movimiento->id}/estado", [
            'estado_movimiento_id' => $registrado->id,
        ])
        ->assertRedirect();

    $movimiento->refresh();
    $this->assertCount(2, $movimiento->historialEstados);

    $cambio = $movimiento->historialEstados->last();
    $this->assertSame('Informado', $cambio->estadoAnterior->nombre);
    $this->assertSame('Registrado', $cambio->estadoNuevo->nombre);
    $this->assertSame($patrimonio->id, $cambio->usuario_id, 'Debe quedar quién hizo el cambio.');
});

test('un usuario comun no entra al panel de patrimonio', function () {
    $this->actingAs(usuarioPorCorreo('carlos@hospital.test'))
        ->get('/patrimonio/dashboard')
        ->assertForbidden();

    $this->actingAs(usuarioPorCorreo('patrimonio@hospital.test'))
        ->get('/patrimonio/dashboard')
        ->assertOk();
});
