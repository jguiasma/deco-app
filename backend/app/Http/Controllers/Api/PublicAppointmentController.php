<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;

class PublicAppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request)
    {
        $data = $request->validated();

        $appointment = Appointment::create([
            'quote_request_id' => $data['quote_request_id'] ?? null,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'city' => $data['city'] ?? null,
            'address' => $data['address'] ?? null,
            'appointment_type' => $data['appointment_type'],
            'appointment_mode' => $data['appointment_mode'],
            'remote_platform' => $data['appointment_mode'] === 'remote'
                ? $data['remote_platform']
                : null,
            'scheduled_at' => $data['scheduled_at'],
            'notes' => $data['notes'] ?? null,
            'status' => 'requested',
        ]);

        return response()->json([
            'message' => 'Votre demande de rendez-vous a bien été envoyée.',
            'data' => [
                'id' => $appointment->id,
                'appointment_mode' => $appointment->appointment_mode,
                'remote_platform' => $appointment->remote_platform,
                'status' => $appointment->status,
                'pricing_information' => $appointment->appointment_mode === 'on_site'
                    ? 'La visite sur place est payante. Le tarif sera confirmé par l’entreprise.'
                    : 'Le meeting à distance via WhatsApp ou Zoom est gratuit.',
            ],
        ], 201);
    }
}
