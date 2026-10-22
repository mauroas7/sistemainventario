<?php

namespace Tests\Feature;

use App\Enums\Rol;
use App\Models\EstadoMovimiento;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\Demo\DemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class DatosInicialesTest extends TestCase
{
    use RefreshDatabase;

    public function test_la_siembra_de_todos_los_entornos_no_crea_usuarios(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(0, User::count());
        $this->assertSame(4, EstadoMovimiento::count());
    }

    public function test_la_demo_no_corre_en_produccion(): void
    {
        $this->app['env'] = 'production';

        $this->expectException(RuntimeException::class);

        $this->app->make(DemoSeeder::class)->setContainer($this->app)->__invoke();
    }

    public function test_crea_el_primer_administrador_desde_la_consola(): void
    {
        $this->artisan('usuarios:crear-administrador', ['email' => 'silvana@hospital.test'])
            ->expectsQuestion('Nombre y apellido', 'Silvana Gómez')
            ->expectsQuestion('Contraseña (mínimo 8 caracteres)', 'una-clave-larga')
            ->assertSuccessful();

        $usuario = User::where('email', 'silvana@hospital.test')->firstOrFail();

        $this->assertSame(Rol::Admin, $usuario->rol);
        $this->assertTrue($usuario->activo);
    }

    public function test_no_crea_un_administrador_con_un_correo_ya_usado(): void
    {
        User::factory()->create(['email' => 'silvana@hospital.test']);

        $this->artisan('usuarios:crear-administrador', ['email' => 'silvana@hospital.test'])
            ->expectsQuestion('Nombre y apellido', 'Silvana Gómez')
            ->expectsQuestion('Contraseña (mínimo 8 caracteres)', 'una-clave-larga')
            ->assertFailed();

        $this->assertSame(1, User::count());
    }

    public function test_dar_de_baja_una_cuenta_conserva_la_fecha_original(): void
    {
        $usuario = User::factory()->create();

        $usuario->update(['activo' => false]);
        $fecha = $usuario->fresh()->fecha_baja;

        $this->travel(2)->days();
        $usuario->fresh()->update(['activo' => false]);

        $this->assertFalse($usuario->fresh()->activo);
        $this->assertTrue($fecha->equalTo($usuario->fresh()->fecha_baja));
        $this->assertSame(0, User::activos()->count());
    }
}
