<?php

namespace Database\Seeders\Demo;

use App\Enums\Rol;
use App\Models\Area;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Áreas, cuentas y bienes de prueba, todas con la clave `demo1234`; se puede volver
 * a correr. El correo dice el puesto y el área: `coordinador@enfermeria.test`,
 * `usuario@enfermeria.test`, `gestor@patrimonio.test`. El admin, sin área, es
 * `admin@hospital.test`.
 */
class DemoSeeder extends SeederDePrueba
{
    public const CLAVE = 'demo1234';

    /** Por área: el coordinador y el usuario. Patrimonio tiene sólo a Gestión de Bienes. */
    private const PERSONAL = [
        'Dirección' => ['Marta', 'Raúl'],
        'Administración' => ['Jorge', 'María'],
        'Recursos Humanos' => ['Claudia', 'Diego'],
        'Mantenimiento' => ['Roberto', 'Sergio'],
        'Enfermería' => ['Laura', 'Ana'],
        'Laboratorio' => ['Sofía', 'Carlos'],
        'Farmacia' => ['Verónica', 'Hernán'],
        'Sistemas' => ['Juan', 'Nicolás'],
    ];

    /** El correo de una cuenta de la demo: `correo('usuario', 'Enfermería')` es `usuario@enfermeria.test`. */
    public static function correo(string $puesto, string $area): string
    {
        return "{$puesto}@".Str::slug($area).'.test';
    }

    public function run(): void
    {
        foreach ([...array_keys(self::PERSONAL), 'Patrimonio'] as $nombre) {
            Area::firstOrCreate(['nombre' => $nombre]);
        }

        // Da de alta áreas y usuarios; no tiene área ni ve bienes.
        User::updateOrCreate(['email' => 'admin@hospital.test'], [
            'name' => 'Admin Test',
            'password' => self::CLAVE,
            'rol' => Rol::Admin,
            'area_id' => null,
            'activo' => true,
        ]);

        // Patrimonio es Gestión de Bienes e Insumos: recibe los avisos y vuelca todo a Diaguita.
        $this->cuenta('Silvana', 'gestor', Rol::Patrimonio, 'Patrimonio');

        foreach (self::PERSONAL as $area => [$coordinador, $usuario]) {
            $this->cuenta($coordinador, 'coordinador', Rol::Coordinador, $area);
            $this->cuenta($usuario, 'usuario', Rol::Usuario, $area);
        }

        // Un compañero de Ana, para ver que un usuario no ve lo que no lo nombra.
        $this->cuenta('Pedro', 'usuario2', Rol::Usuario, 'Enfermería');

        // Dada de baja: no entra y no se ofrece como responsable.
        $this->cuenta('Elena', 'baja', Rol::Usuario, 'Farmacia', activa: false);

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
