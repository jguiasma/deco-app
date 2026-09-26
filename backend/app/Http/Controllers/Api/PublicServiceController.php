<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;

class PublicServiceController extends Controller
{
    public function index()
    {
        $services = Service::query()
            ->where('is_active', true)
            ->with('activePricingRule')
            ->orderBy('sort_order')
            ->get();

        return ServiceResource::collection($services);
    }
}
