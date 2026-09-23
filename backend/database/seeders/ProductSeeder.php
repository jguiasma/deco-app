<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Moulure murale 2 m × 80 cm',
                'slug' => 'moulure-murale-2m-80-epaisseur-4cm',
                'category' => 'Moulures',
                'description' => 'Moulure murale décorative, épaisseur 4 cm.',
                'price' => null,
                'price_label' => 'Sur devis',
                'image_path' => 'products/moulure-4cm.jpg',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Moulure type S 2 m × 80 cm',
                'slug' => 'moulure-type-s-2m-80-epaisseur-2cm',
                'category' => 'Moulures',
                'description' => 'Moulure type S, épaisseur 2 cm.',
                'price' => 18,
                'price_label' => '18 DT',
                'image_path' => 'products/moulure-type-s.jpg',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Miroir biseauté 30 × 30 cm',
                'slug' => 'miroir-biseaute-30x30',
                'category' => 'Miroirs',
                'description' => 'Miroir biseauté carré 30 × 30 cm.',
                'price' => 35,
                'price_label' => '35 DT',
                'image_path' => 'products/miroir-biseaute.jpg',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'بديل chipboard',
                'slug' => 'badil-chipboard',
                'category' => 'Revêtements',
                'description' => 'Revêtement décoratif en chipboard.',
                'price' => null,
                'price_label' => 'Sur devis',
                'image_path' => 'products/badil-chipboard.jpg',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Bardage rayuré 16 cm × 2,90 m',
                'slug' => 'bardage-raye-16cm-290cm',
                'category' => 'Bardages',
                'description' => 'Bardage rayuré décoratif.',
                'price' => 48,
                'price_label' => '48 DT / pièce',
                'image_path' => 'products/bardage-raye.jpg',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Meuble d’entrée',
                'slug' => 'meuble-entree',
                'category' => 'Meubles',
                'description' => 'Meuble d’entrée sur mesure.',
                'price' => 150,
                'price_label' => 'À partir de 150 DT',
                'image_path' => 'products/meuble-entree.jpg',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}