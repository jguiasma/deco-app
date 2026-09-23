<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'in:requested,confirmed,completed,cancelled'],
            'scheduled_at' => ['sometimes', 'nullable', 'date'],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
