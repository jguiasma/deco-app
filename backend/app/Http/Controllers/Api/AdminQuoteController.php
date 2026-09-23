<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use App\Notifications\QuoteSentToClient;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class AdminQuoteController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $quotes = Quote::query()
            ->with(['items', 'quoteRequest'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = trim((string) $request->input('search'));

                $query->where(function ($query) use ($search) {
                    $query->where('quote_number', 'like', "%{$search}%")
                        ->orWhereHas('quoteRequest', function ($query) use ($search) {
                            $query->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(20);

        return QuoteResource::collection($quotes);
    }

    public function store(StoreQuoteRequest $request)
    {
        $this->ensureAdmin($request);
        $data = $request->validated();

        $quote = DB::transaction(function () use ($data) {
            $subtotal = round(collect($data['items'])->sum(
                fn (array $item) => (float) $item['quantity'] * (float) $item['unit_price']
            ), 3);
            $discount = (float) ($data['discount'] ?? 0);
            $total = round($subtotal - $discount, 3);

            if ($discount > $subtotal) {
                throw ValidationException::withMessages([
                    'discount' => ['La remise ne peut pas dépasser le sous-total.'],
                ]);
            }

            $deposit = (float) ($data['deposit'] ?? 0);

            if ($deposit > $total) {
                throw ValidationException::withMessages([
                    'deposit' => ['L’avance ne peut pas dépasser le total du devis.'],
                ]);
            }

            $nextNumber = (Quote::query()->max('id') ?? 0) + 1;

            $quote = Quote::create([
                'quote_request_id' => $data['quote_request_id'] ?? null,
                'quote_number' => sprintf('BWD-%s-%05d', now()->format('Ymd'), $nextNumber),
                'status' => 'draft',
                'currency' => 'TND',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'deposit' => $deposit,
                'remaining' => round($total - $deposit, 3),
                'issued_at' => $data['issued_at'] ?? now()->toDateString(),
                'valid_until' => $data['valid_until'] ?? null,
                'conditions' => $data['conditions'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $index => $item) {
                $quantity = (float) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];

                $quote->items()->create([
                    'label' => $item['label'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $quantity,
                    'unit' => $item['unit'] ?? null,
                    'unit_price' => $unitPrice,
                    'line_total' => round($quantity * $unitPrice, 3),
                    'sort_order' => $index,
                ]);
            }

            return $quote;
        });

        return QuoteResource::make($quote->load(['items', 'quoteRequest']))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Quote $quote)
    {
        $this->ensureAdmin($request);

        return QuoteResource::make($quote->load(['items', 'quoteRequest']));
    }

    public function pdf(Request $request, Quote $quote)
    {
        $this->ensureAdmin($request);

        $quote->load(['items', 'quoteRequest']);

        return Pdf::loadView('pdf.quote', compact('quote'))
            ->setPaper('a4')
            ->download("devis-{$quote->quote_number}.pdf");
    }

    public function update(UpdateQuoteRequest $request, Quote $quote)
    {
        $this->ensureAdmin($request);

        $data = $request->validated();
        $previousStatus = $quote->status;

        $quote->update($data);

        if (($data['status'] ?? null) === 'sent' && $previousStatus !== 'sent') {
            $quote->load(['items', 'quoteRequest']);

            if ($quote->quoteRequest?->email) {
                Notification::route('mail', $quote->quoteRequest->email)
                    ->notify(new QuoteSentToClient($quote));
            }
        }

        return QuoteResource::make($quote->load(['items', 'quoteRequest']));
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');
    }
}
