<?php

namespace Tests\Feature;

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
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cubre el circuito de movimientos de bienes: quién puede informarlos, qué le pasa al
 * bien cuando se informa uno y cómo queda todo si después se anula.
 */
class MovimientosTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([DatabaseSeeder::class, DemoSeeder::class]);
    }

    private function usuario(string $email): User
    {
        return User::where('email', $email)->firstOrFail();
    }

    private function bien(string $codigo): Bien
    {
        return Bien::where('codigo', $codigo)->firstOrFail();
    }

    private function area(string $nombre): Area
    {
        return Area::where('nombre', $nombre)->firstOrFail();
    }

    /**
     * Datos mínimos válidos para informar el traslado de un bien.
     */
    private function datosDeMovimiento(Bien $bien, Area $destino, ?User $responsable = null): array
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

    public function test_informar_un_movimiento_mueve_el_bien_y_cambia_su_responsable(): void
    {
        $juan = $this->usuario('juan@hospital.test');      // Sistemas
        $carlos = $this->usuario('carlos@hospital.test');  // Laboratorio
        $bien = $this->bien('NB001');                      // está en Sistemas
        $laboratorio = $this->area('Laboratorio');

        $this->actingAs($juan)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $laboratorio, $carlos))
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
    }

    public function test_un_movimiento_sin_responsable_deja_el_bien_sin_persona_a_cargo(): void
    {
        // Es un caso válido: quien informa no siempre sabe quién lo va a recibir, y
        // Patrimonio define el responsable después. Lo que no puede pasar es que el bien
        // siga figurando a cargo de quien ya no lo tiene.
        $juan = $this->usuario('juan@hospital.test');
        $bien = $this->bien('NB001');
        $mantenimiento = $this->area('Mantenimiento');

        $this->actingAs($juan)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $mantenimiento))
            ->assertRedirect();

        $bien->refresh();

        $this->assertSame($mantenimiento->id, $bien->area_id);
        $this->assertNull($bien->responsable_id, 'El bien no puede seguir a cargo del responsable anterior.');
    }

    public function test_un_usuario_no_puede_informar_movimientos_de_bienes_de_otra_area(): void
    {
        $carlos = $this->usuario('carlos@hospital.test'); // Laboratorio
        $bien = $this->bien('NB001');                     // está en Sistemas
        $farmacia = $this->area('Farmacia');

        $this->actingAs($carlos)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $farmacia))
            ->assertForbidden();

        $this->assertSame(0, Movimiento::count(), 'No debería haberse registrado ningún movimiento.');
    }

    public function test_el_destino_no_puede_ser_la_misma_area_de_origen(): void
    {
        $juan = $this->usuario('juan@hospital.test');
        $bien = $this->bien('NB001');
        $sistemas = $this->area('Sistemas');

        $this->actingAs($juan)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $sistemas))
            ->assertSessionHasErrors('area_destino_id');

        $this->assertSame(0, Movimiento::count());
    }

    public function test_el_responsable_nuevo_debe_pertenecer_al_area_de_destino(): void
    {
        $juan = $this->usuario('juan@hospital.test');
        $ana = $this->usuario('ana@hospital.test'); // Enfermería, no Laboratorio
        $bien = $this->bien('NB001');
        $laboratorio = $this->area('Laboratorio');

        $this->actingAs($juan)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $laboratorio, $ana))
            ->assertSessionHasErrors('responsable_nuevo_id');

        $this->assertSame(0, Movimiento::count());
    }

    public function test_anular_un_movimiento_devuelve_el_bien_a_donde_estaba(): void
    {
        $juan = $this->usuario('juan@hospital.test');
        $carlos = $this->usuario('carlos@hospital.test');
        $bien = $this->bien('NB001');
        $sistemas = $this->area('Sistemas');
        $laboratorio = $this->area('Laboratorio');

        $this->actingAs($juan)
            ->post('/envio/crear-ticket', $this->datosDeMovimiento($bien, $laboratorio, $carlos));

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
    }

    public function test_la_bandeja_solo_muestra_los_movimientos_del_area_del_usuario(): void
    {
        $juan = $this->usuario('juan@hospital.test');    // Sistemas
        $maria = $this->usuario('maria@hospital.test');  // Administración

        // Movimiento entre Sistemas y Laboratorio: no toca a Administración.
        $this->actingAs($juan)->post('/envio/crear-ticket', $this->datosDeMovimiento(
            $this->bien('NB001'),
            $this->area('Laboratorio')
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
    }

    public function test_cada_rol_ve_en_la_bandeja_lo_que_le_toca(): void
    {
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
            $this->actingAs($this->usuario("{$nombre}@hospital.test"))
                ->get('/recepcion/bandeja?estado=todos')
                ->assertInertia(fn ($page) => $page
                    ->where('movimientos.total', $cantidad)
                    ->where('resumen.total', $cantidad));
        }
    }

    public function test_un_usuario_no_ve_ni_acusa_lo_de_su_area_que_no_es_suyo(): void
    {
        $this->seed(MovimientosSeeder::class);

        // Carlos mandó el electrocardiógrafo a Enfermería, a cargo de Ana.
        $movimiento = Movimiento::whereHas('bien', fn ($q) => $q->where('codigo', 'ECG001'))->firstOrFail();

        $pedro = $this->usuario('pedro@hospital.test'); // Usuario de Enfermería
        $this->actingAs($pedro)->get("/recepcion/movimientos/{$movimiento->id}")->assertForbidden();
        $this->actingAs($pedro)->post("/recepcion/movimientos/{$movimiento->id}/confirmar")->assertForbidden();

        $this->actingAs($this->usuario('ana@hospital.test'))->get("/recepcion/movimientos/{$movimiento->id}")->assertOk();

        $laura = $this->usuario('laura@hospital.test'); // coordinadora de Enfermería
        $this->actingAs($laura)->post("/recepcion/movimientos/{$movimiento->id}/confirmar")->assertSessionHasNoErrors();
        $this->assertSame($laura->id, $movimiento->fresh()->recibido_por);
    }

    public function test_cada_cambio_de_estado_queda_registrado_con_su_autor(): void
    {
        $juan = $this->usuario('juan@hospital.test');
        $patrimonio = $this->usuario('patrimonio@hospital.test'); // admin
        $bien = $this->bien('NB001');

        $this->actingAs($juan)->post('/envio/crear-ticket', $this->datosDeMovimiento(
            $bien,
            $this->area('Laboratorio')
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
    }

    public function test_un_usuario_comun_no_entra_al_panel_de_patrimonio(): void
    {
        $this->actingAs($this->usuario('carlos@hospital.test'))
            ->get('/patrimonio/dashboard')
            ->assertForbidden();

        $this->actingAs($this->usuario('patrimonio@hospital.test'))
            ->get('/patrimonio/dashboard')
            ->assertOk();
    }
}
