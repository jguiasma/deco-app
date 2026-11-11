<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote_id' => $this->quote_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'start_date' => $this->start_date?->toDateString(),
            'expected_completion_date' => $this->expected_completion_date?->toDateString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'admin_notes' => $this->admin_notes,
            'quote' => $this->whenLoaded('quote', fn () => [
                'id' => $this->quote->id,
                'quote_number' => $this->quote->quote_number,
                'total' => $this->quote->total,
                'currency' => $this->quote->currency,
                'quote_request' => $this->quote->quoteRequest ? [
                    'id' => $this->quote->quoteRequest->id,
                    'first_name' => $this->quote->quoteRequest->first_name,
                    'last_name' => $this->quote->quoteRequest->last_name,
                    'phone' => $this->quote->quoteRequest->phone,
                    'service' => $this->quote->quoteRequest->service ? [
                        'title' => $this->quote->quoteRequest->service->title,
                    ] : null,
                ] : null,
            ]),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
