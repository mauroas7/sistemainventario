<?php

namespace Database\Seeders;

use App\Models\Bien;
use Illuminate\Database\Seeder;

class BienSeeder extends Seeder
{
    public function run(): void
    {
        $bienes = [
            [
                'codigo_patrimonial' => 'B001',
                'nombre' => 'Notebook Dell Latitude',
                'categoria' => 'Informática',
                'marca' => 'Dell',
                'modelo' => 'Latitude 5420',
                'estado' => 'Disponible',
                'ubicacion' => 'Administración',
            ],
            [
                'codigo_patrimonial' => 'B002',
                'nombre' => 'Impresora HP LaserJet',
                'categoria' => 'Impresión',
                'marca' => 'HP',
                'modelo' => 'M404dn',
                'estado' => 'Disponible',
                'ubicacion' => 'Secretaría',
            ],
            [
                'codigo_patrimonial' => 'B003',
                'nombre' => 'Monitor LG 24 pulgadas',
                'categoria' => 'Informática',
                'marca' => 'LG',
                'modelo' => '24MK430H',
                'estado' => 'Disponible',
                'ubicacion' => 'Laboratorio',
            ],
            [
                'codigo_patrimonial' => 'B004',
                'nombre' => 'Proyector Epson',
                'categoria' => 'Audiovisual',
                'marca' => 'Epson',
                'modelo' => 'PowerLite',
                'estado' => 'Disponible',
                'ubicacion' => 'Aula 1',
            ],
            [
                'codigo_patrimonial' => 'B005',
                'nombre' => 'CPU Lenovo ThinkCentre',
                'categoria' => 'Informática',
                'marca' => 'Lenovo',
                'modelo' => 'ThinkCentre',
                'estado' => 'Disponible',
                'ubicacion' => 'Administración',
            ],
            [
                'codigo_patrimonial' => 'B006',
                'nombre' => 'Silla ergonómica',
                'categoria' => 'Mobiliario',
                'marca' => 'Rolic',
                'modelo' => 'ERG-1',
                'estado' => 'Disponible',
                'ubicacion' => 'Dirección',
            ],
            [
                'codigo_patrimonial' => 'B007',
                'nombre' => 'Escritorio de oficina',
                'categoria' => 'Mobiliario',
                'marca' => 'Genérico',
                'modelo' => '120x60',
                'estado' => 'Disponible',
                'ubicacion' => 'Dirección',
            ],
            [
                'codigo_patrimonial' => 'B008',
                'nombre' => 'Notebook HP ProBook',
                'categoria' => 'Informática',
                'marca' => 'HP',
                'modelo' => 'ProBook 450',
                'estado' => 'Disponible',
                'ubicacion' => 'Recursos Humanos',
            ],
            [
                'codigo_patrimonial' => 'B009',
                'nombre' => 'Scanner Canon',
                'categoria' => 'Digitalización',
                'marca' => 'Canon',
                'modelo' => 'LiDE 300',
                'estado' => 'Disponible',
                'ubicacion' => 'Archivo',
            ],
            [
                'codigo_patrimonial' => 'B010',
                'nombre' => 'Router TP-Link',
                'categoria' => 'Redes',
                'marca' => 'TP-Link',
                'modelo' => 'Archer C6',
                'estado' => 'Disponible',
                'ubicacion' => 'Sistemas',
            ],
            [
                'codigo_patrimonial' => 'B011',
                'nombre' => 'Switch Cisco',
                'categoria' => 'Redes',
                'marca' => 'Cisco',
                'modelo' => '2960',
                'estado' => 'Disponible',
                'ubicacion' => 'Sistemas',
            ],
            [
                'codigo_patrimonial' => 'B012',
                'nombre' => 'Monitor Samsung 27 pulgadas',
                'categoria' => 'Informática',
                'marca' => 'Samsung',
                'modelo' => 'F27T350',
                'estado' => 'Disponible',
                'ubicacion' => 'Contaduría',
            ],
            [
                'codigo_patrimonial' => 'B013',
                'nombre' => 'UPS APC',
                'categoria' => 'Energía',
                'marca' => 'APC',
                'modelo' => 'BV1000I',
                'estado' => 'Disponible',
                'ubicacion' => 'Sala de servidores',
            ],
            [
                'codigo_patrimonial' => 'B014',
                'nombre' => 'Tablet Samsung',
                'categoria' => 'Informática',
                'marca' => 'Samsung',
                'modelo' => 'Galaxy Tab A9',
                'estado' => 'Disponible',
                'ubicacion' => 'Enfermería',
            ],
            [
                'codigo_patrimonial' => 'B015',
                'nombre' => 'Notebook ASUS VivoBook',
                'categoria' => 'Informática',
                'marca' => 'ASUS',
                'modelo' => 'VivoBook 15',
                'estado' => 'Disponible',
                'ubicacion' => 'Compras',
            ],
        ];

        foreach ($bienes as $bien) {
            Bien::updateOrCreate(
                ['codigo_patrimonial' => $bien['codigo_patrimonial']],
                $bien
            );
        }
    }
}
