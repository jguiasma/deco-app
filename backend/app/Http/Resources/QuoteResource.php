<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote_number' => $this->quote_number,
            'quote_request_id' => $this->quote_request_id,
            'status' => $this->status,
            'currency' => $this->currency,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'total' => $this->total,
            'deposit' => $this->deposit,
            'remaining' => $this->remaining,
            'issued_at' => $this->issued_at?->toDateString(),
            'valid_until' => $this->valid_until?->toDateString(),
            'conditions' => $this->conditions,
            'notes' => $this->notes,
            'quote_request' => $this->whenLoaded('quoteRequest', fn () => $this->quoteRequest ? [
                'id' => $this->quoteRequest->id,
                'first_name' => $this->quoteRequest->first_name,
                'last_name' => $this->quoteRequest->last_name,
                'phone' => $this->quoteRequest->phone,
                'email' => $this->quoteRequest->email,
                'city' => $this->quoteRequest->city,
                'address' => $this->quoteRequest->address,
                'description' => $this->quoteRequest->description,
                'service' => $this->quoteRequest->service ? [
                    'title' => $this->quoteRequest->service->title,
                ] : null,
                'appointments' => $this->when(
                    $this->quoteRequest->relationLoaded('appointments'),
                    fn () => $this->quoteRequest->appointments
                        ->sortByDesc('scheduled_at')
                        ->values()
                        ->map(fn ($appointment) => [
                            'id' => $appointment->id,
                            'appointment_mode' => $appointment->appointment_mode,
                            'remote_platform' => $appointment->remote_platform,
                            'scheduled_at' => $appointment->scheduled_at?->toISOString(),
                            'status' => $appointment->status,
                            'notes' => $appointment->notes,
                        ])
                ),
            ] : null),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'label' => $item->label,
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit' => $item->unit,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
            ])),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
