<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Area;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@hospital.test',
            'password' => Hash::make('password'),
            'rol' => 'admin',
            'area_id' => Area::where('nombre', 'Dirección')->first()->id,
        ]);

        User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@hospital.test',
            'password' => Hash::make('password'),
            'rol' => 'coordinador',
            'area_id' => Area::where('nombre', 'Sistemas')->first()->id,
        ]);

        User::create([
            'name' => 'Ana Gómez',
            'email' => 'ana@hospital.test',
            'password' => Hash::make('password'),
            'rol' => 'usuario',
            'area_id' => Area::where('nombre', 'Enfermería')->first()->id,
        ]);

        User::create([
            'name' => 'Carlos Ruiz',
            'email' => 'carlos@hospital.test',
            'password' => Hash::make('password'),
            'rol' => 'usuario',
            'area_id' => Area::where('nombre', 'Laboratorio')->first()->id,
        ]);

        User::create([
            'name' => 'María López',
            'email' => 'maria@hospital.test',
            'password' => Hash::make('password'),
            'rol' => 'usuario',
            'area_id' => Area::where('nombre', 'Administración')->first()->id,
        ]);
    }
}
