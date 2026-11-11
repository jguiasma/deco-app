<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServicePricingRule;
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

        $revetement = Service::where('slug', 'revetement-mural')->firstOrFail();
        $meuble = Service::where('slug', 'meuble-sur-mesure')->firstOrFail();

        $hierarchy = [
            [$revetement, 'revetement-au-metre', 'Revêtement mural au mètre', 'estimate', 1],
            [$revetement, 'revetement-decoratif', 'Revêtement décoratif', 'on_quote', 2],
            [$revetement, 'revetement-tv', 'Revêtement TV', 'estimate', 3],
            [$revetement, 'revetement-eclairage', 'Revêtement avec éclairage', 'on_quote', 4],
            [$meuble, 'dressing-rangement', 'Dressing & rangement', 'estimate', 1],
            [$meuble, 'meuble-tv', 'Meuble TV', 'estimate', 2],
            [$meuble, 'meuble-entree', 'Meuble d’entrée', 'on_quote', 3],
            [$meuble, 'meuble-multifonction', 'Meuble multifonction', 'on_quote', 4],
        ];

        foreach ($hierarchy as [$parent, $slug, $title, $pricingMode, $sortOrder]) {
            Service::updateOrCreate(['slug' => $slug], [
                'parent_id' => $parent->id,
                'title' => $title,
                'description' => null,
                'pricing_mode' => $pricingMode,
                'is_active' => true,
                'sort_order' => $sortOrder,
            ]);
        }

        $dressing = Service::where('slug', 'dressing-rangement')->firstOrFail();
        $meubleTv = Service::where('slug', 'meuble-tv')->firstOrFail();
        $meubleEntree = Service::where('slug', 'meuble-entree')->firstOrFail();

        foreach ([
            [$dressing, 'dressing-ouvert', 'Dressing ouvert', 'on_quote', 1],
            [$dressing, 'dressing-ferme', 'Dressing fermé', 'on_quote', 2],
            [$dressing, 'dressing-miroir', 'Dressing avec miroir', 'on_quote', 3],
            [$meubleTv, 'meuble-tv-suspendu', 'Meuble TV suspendu', 'on_quote', 1],
            [$meubleTv, 'meuble-tv-sol', 'Meuble TV au sol', 'on_quote', 2],
            [$meubleTv, 'mur-tv-rangement', 'Mur TV + rangement', 'on_quote', 3],
            [$meubleEntree, 'console-entree', 'Console', 'on_quote', 1],
            [$meubleEntree, 'meuble-chaussures', 'Meuble à chaussures', 'on_quote', 2],
        ] as [$parent, $slug, $title, $pricingMode, $sortOrder]) {
            Service::updateOrCreate(['slug' => $slug], [
                'parent_id' => $parent->id,
                'title' => $title,
                'description' => null,
                'pricing_mode' => $pricingMode,
                'is_active' => true,
                'sort_order' => $sortOrder,
            ]);
        }

        foreach ([
            ['revetement-au-metre', 'meter', 'per_unit', null, 330, 330],
            ['revetement-tv', 'piece', 'fixed', null, 700, 3500],
        ] as [$slug, $unit, $method, $referenceQuantity, $minPrice, $maxPrice]) {
            $service = Service::where('slug', $slug)->firstOrFail();

            ServicePricingRule::updateOrCreate(
                ['service_id' => $service->id, 'is_active' => true],
                [
                    'unit' => $unit,
                    'calculation_method' => $method,
                    'reference_quantity' => $referenceQuantity,
                    'min_price' => $minPrice,
                    'max_price' => $maxPrice,
                    'is_active' => true,
                ],
            );
        }
    }
}
