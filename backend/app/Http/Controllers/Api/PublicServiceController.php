<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;

class PublicServiceController extends Controller
{
    public function index()
    {
        $allServices = Service::query()
            ->where('is_active', true)
            ->with('activePricingRule')
            ->orderBy('sort_order')
            ->get();

        $byParent = $allServices->groupBy('parent_id');
        $attachChildren = function (Service $service) use (&$attachChildren, $byParent): Service {
            $children = ($byParent->get($service->id) ?? collect())
                ->map($attachChildren)
                ->values();

            $service->setRelation('children', $children);

            return $service;
        };

        $services = ($byParent->get(null) ?? collect())
            ->map($attachChildren)
            ->values();

        return ServiceResource::collection($services);
    }
}
