<?php

use App\Models\Service;
use App\Models\ServicePricingRule;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('permet à un client d envoyer une demande de devis', function () {
    $service = Service::create([
        'title' => 'Revêtement mural',
        'slug' => 'revetement-mural',
        'description' => 'Habillage mural décoratif.',
        'image_path' => 'services/revetement-mural.jpg',
    ]);

    ServicePricingRule::create([
        'service_id' => $service->id,
        'unit' => 'm2',
        'calculation_method' => 'prorata',
        'reference_quantity' => 100,
        'min_price' => 200,
        'max_price' => 400,
        'is_active' => true,
    ]);

    $response = $this->postJson('/api/quote-requests', [
        'first_name' => 'Amira',
        'last_name' => 'Ben Salem',
        'phone' => '20123456',
        'email' => 'amira@example.com',
        'city' => 'Tunis',
        'service_id' => $service->id,
        'quantity' => 20,
        'description' => 'Je souhaite habiller le mur de mon salon.',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('data.status', 'new');

    $this->assertDatabaseHas('quote_requests', [
        'first_name' => 'Amira',
        'last_name' => 'Ben Salem',
        'phone' => '20123456',
        'service_id' => $service->id,
        'status' => 'new',
    ]);
}); 
