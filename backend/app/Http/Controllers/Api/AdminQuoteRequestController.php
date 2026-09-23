<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteRequestRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;

class AdminQuoteRequestController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');

        $quoteRequests = QuoteRequest::query()
            ->with(['service', 'pricingRule', 'images'])
            ->when($request->filled('phone'), function ($query) use ($request) {
                $query->where('phone', 'like', '%' . $request->input('phone') . '%');
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->latest()
            ->paginate(15);

        return QuoteRequestResource::collection($quoteRequests);
    }

    public function update(
        UpdateQuoteRequestRequest $request,
        QuoteRequest $quoteRequest
    ) {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');

        $quoteRequest->update($request->validated());

        return QuoteRequestResource::make(
            $quoteRequest->load(['service', 'pricingRule', 'images'])
        );
    }
}
