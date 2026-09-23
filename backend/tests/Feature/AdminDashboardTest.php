<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('permet à un administrateur connecté d accéder au dashboard', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    Sanctum::actingAs($admin);

    $this->getJson('/api/admin/dashboard')
        ->assertOk()
        ->assertJsonPath('data.quote_requests.total', 0)
        ->assertJsonStructure([
            'data' => [
                'quote_requests',
                'appointments',
                'quotes',
                'projects',
            ],
        ]);
});