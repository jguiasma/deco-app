<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        return ServiceResource::collection(
            Service::query()->with('activePricingRule')->orderBy('sort_order')->get()
        );
    }

    public function update(Request $request, Service $service)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'pricing_mode' => ['sometimes', 'in:estimate,on_quote'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $service->update($data);

        return ServiceResource::make($service->load('activePricingRule'));
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');
    }
}
