<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'Revêtement mural',
                'slug' => 'revetement-mural',
                'description' => 'Habillage élégant de vos murs avec des matériaux nobles, moulures décoratives et bardages.',
                'image_path' => 'services/revetement-mural.jpg',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Meuble sur mesure',
                'slug' => 'meuble-sur-mesure',
                'description' => 'Conception et fabrication de mobilier unique, adapté à votre espace et à votre style de vie.',
                'image_path' => 'services/meuble-sur-mesure.jpg',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Conception 3D',
                'slug' => 'conception-3d',
                'description' => 'Visualisez votre futur intérieur grâce à des modélisations 3D réalistes avant les travaux.',
                'image_path' => 'services/conception-3d.jpg',
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }
}