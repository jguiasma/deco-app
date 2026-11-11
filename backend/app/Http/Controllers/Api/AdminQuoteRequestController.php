<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteRequestRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Models\Appointment;
use App\Models\Quote;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            ->paginate(100);

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

    /**
     * Supprime un dossier complet : rendez-vous, devis, projet et photos.
     * Le client n'est pas supprimé car il peut être lié à d'autres dossiers.
     */
    public function destroy(Request $request, QuoteRequest $quoteRequest)
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');

        $images = $quoteRequest->images()->get(['disk', 'path']);
        $quoteIds = Quote::query()
            ->where('quote_request_id', $quoteRequest->id)
            ->pluck('id');

        DB::transaction(function () use ($quoteRequest, $quoteIds) {
            Appointment::query()
                ->where('quote_request_id', $quoteRequest->id)
                ->delete();

            // La suppression d'un devis entraîne ses lignes et son projet associé.
            Quote::query()->whereIn('id', $quoteIds)->delete();
            $quoteRequest->delete();
        });

        foreach ($images as $image) {
            Storage::disk($image->disk)->delete($image->path);
        }

        foreach ($quoteIds as $quoteId) {
            Storage::disk('local')->delete("quote-pdfs/{$quoteId}.pdf");
        }

        return response()->noContent();
    }
}
