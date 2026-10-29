<?php

namespace Database\Seeders\Demo;

use App\Enums\Rol;
use App\Models\Area;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Áreas, cuentas y bienes de prueba, todas con la clave `demo1234`; se puede volver
 * a correr. El correo dice rol y área: `coordinador.enfermeria@hospital.test`,
 * `usuario1.enfermeria@…`, `usuario2.enfermeria@…`, `admin1.patrimonio@…`.
 */
class DemoSeeder extends SeederDePrueba
{
    public const CLAVE = 'demo1234';

    /** Por área: el coordinador y los dos usuarios. Patrimonio tiene sólo administradores. */
    private const PERSONAL = [
        'Dirección' => ['Marta', 'Raúl', 'Inés'],
        'Administración' => ['Jorge', 'María', 'Pablo'],
        'Recursos Humanos' => ['Claudia', 'Diego', 'Paula'],
        'Mantenimiento' => ['Roberto', 'Sergio', 'Lucía'],
        'Enfermería' => ['Laura', 'Ana', 'Pedro'],
        'Laboratorio' => ['Sofía', 'Carlos', 'Martín'],
        'Farmacia' => ['Verónica', 'Hernán', 'Julia'],
        'Sistemas' => ['Juan', 'Nicolás', 'Carla'],
    ];

    /** El correo de una cuenta de la demo: `correo('usuario1', 'Enfermería')`. */
    public static function correo(string $puesto, string $area): string
    {
        return "{$puesto}.".Str::slug($area).'@hospital.test';
    }

    public function run(): void
    {
        foreach ([...array_keys(self::PERSONAL), 'Patrimonio'] as $nombre) {
            Area::firstOrCreate(['nombre' => $nombre]);
        }

        // Patrimonio es Gestión de Bienes e Insumos: recibe los avisos y vuelca todo a Diaguita.
        $this->cuenta('Silvana', 'admin1', Rol::Admin, 'Patrimonio');
        $this->cuenta('Gustavo', 'admin2', Rol::Admin, 'Patrimonio');

        foreach (self::PERSONAL as $area => [$coordinador, $usuario1, $usuario2]) {
            $this->cuenta($coordinador, 'coordinador', Rol::Coordinador, $area);
            $this->cuenta($usuario1, 'usuario1', Rol::Usuario, $area);
            $this->cuenta($usuario2, 'usuario2', Rol::Usuario, $area);
        }

        // Dada de baja: no entra y no se ofrece como responsable.
        $this->cuenta('Elena', 'usuario3', Rol::Usuario, 'Farmacia', activa: false);

        $this->call(BienesSeeder::class);
    }

    private function cuenta(string $nombre, string $puesto, Rol $rol, string $area, bool $activa = true): void
    {
        User::updateOrCreate(['email' => self::correo($puesto, $area)], [
            'name' => "{$nombre} Test",
            'password' => self::CLAVE,
            'rol' => $rol,
            'area_id' => Area::where('nombre', $area)->value('id'),
            'activo' => $activa,
        ]);
    }
}
