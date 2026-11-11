<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\QuoteRequest;

class PublicAppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request)
    {
        $data = $request->validated();

        // Un prospect peut prendre directement rendez-vous, sans estimation.
        // On crée alors son dossier afin que le devis final puisse lui être lié.
        $quoteRequestId = $data['quote_request_id'] ?? null;
        if (! $quoteRequestId) {
            $quoteRequest = QuoteRequest::create([
                'client_id' => null,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'description' => $data['notes'] ?? 'Première consultation demandée directement.',
                'status' => 'new',
            ]);
            $quoteRequestId = $quoteRequest->id;
        }

        $appointment = Appointment::create([
            'quote_request_id' => $quoteRequestId,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'],
            'email' => $data['email'],
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
