<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Creamos el usuario Administrador
        User::factory()->create([
            'name' => 'Admin Patrimonio',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('admin123'),
        ]);

        // 2. Creamos un usuario Coordinador (Usuario normal)
        User::factory()->create([
            'name' => 'Coordinador',
            'email' => 'coordinador@hospital.com',
            'password' => Hash::make('123123123'),
        ]);
    }
}