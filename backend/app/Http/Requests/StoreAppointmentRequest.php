<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quote_request_id' => ['nullable', 'integer', 'exists:quote_requests,id'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'city' => ['nullable', 'required_if:appointment_mode,on_site', 'string', 'max:100'],
            'address' => ['nullable', 'required_if:appointment_mode,on_site', 'string', 'max:1000'],
            'appointment_type' => ['required', 'in:visit,measurement,installation,delivery,other'],
            'appointment_mode' => ['required', 'in:on_site,remote'],
            'remote_platform' => ['nullable', 'required_if:appointment_mode,remote', 'in:whatsapp,zoom'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
