<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'quote_request_id' => $this->quote_request_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'city' => $this->city,
            'address' => $this->address,
            'appointment_type' => $this->appointment_type,
            'appointment_mode' => $this->appointment_mode,
            'remote_platform' => $this->remote_platform,
            'scheduled_at' => $this->scheduled_at?->toISOString(),
            'status' => $this->status,
            'notes' => $this->notes,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
