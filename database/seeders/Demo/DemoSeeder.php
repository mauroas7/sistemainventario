<?php

namespace Database\Seeders\Demo;

use App\Enums\Rol;
use App\Models\Area;
use App\Models\User;

/** Áreas, usuarios y bienes de prueba. Clave `password`; se puede volver a correr. */
class DemoSeeder extends SeederDePrueba
{
    public function run(): void
    {
        $areas = [
            'Dirección', 'Administración', 'Recursos Humanos', 'Mantenimiento', 'Enfermería',
            'Laboratorio', 'Farmacia', 'Sistemas', 'Patrimonio',
        ];

        foreach ($areas as $nombre) {
            Area::firstOrCreate(['nombre' => $nombre]);
        }

        // Patrimonio es Gestión de Bienes e Insumos: recibe los avisos y vuelca todo a Diaguita.
        $usuarios = [
            ['Silvana - Gestión de Bienes', 'patrimonio@hospital.test', Rol::Admin, 'Patrimonio'],
            ['Administrador', 'admin@hospital.test', Rol::Admin, 'Dirección'],
            ['Juan Pérez', 'juan@hospital.test', Rol::Coordinador, 'Sistemas'],
            ['Ana Gómez', 'ana@hospital.test', Rol::Usuario, 'Enfermería'],
            ['Carlos Ruiz', 'carlos@hospital.test', Rol::Usuario, 'Laboratorio'],
            ['María López', 'maria@hospital.test', Rol::Usuario, 'Administración'],
        ];

        foreach ($usuarios as [$nombre, $email, $rol, $area]) {
            User::updateOrCreate(['email' => $email], [
                'name' => $nombre,
                'password' => 'password',
                'rol' => $rol,
                'area_id' => Area::where('nombre', $area)->value('id'),
            ]);
        }

        $this->call(BienesSeeder::class);
    }
}
