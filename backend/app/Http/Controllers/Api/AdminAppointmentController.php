<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;

class AdminAppointmentController extends Controller
{
    public function store(StoreAdminAppointmentRequest $request)
    {
        $this->ensureAdmin($request);

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
            'status' => $data['status'] ?? 'confirmed',
            'notes' => $data['notes'] ?? null,
            'admin_notes' => $data['admin_notes'] ?? null,
        ]);

        return AppointmentResource::make($appointment)
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $appointments = Appointment::query()
            ->with(['quoteRequest.service'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('mode'), fn ($query) => $query->where('appointment_mode', $request->input('mode')))
            ->when($request->filled('platform'), fn ($query) => $query->where('remote_platform', $request->input('platform')))
            // Les dernières demandes reçues doivent être visibles en premier.
            ->latest('created_at')
            ->paginate(100);

        return AppointmentResource::collection($appointments);
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $this->ensureAdmin($request);

        $data = $request->validated();
        $appointment->update($data);

        // Compatibilité avec les rendez-vous directs créés avant ce flux :
        // dès qu'ils sont terminés, ils reçoivent un dossier de devis.
        if ($appointment->status === 'completed') {
            $this->attachQuoteRequest($appointment);
        }

        return AppointmentResource::make(
            $appointment->fresh()->load(['quoteRequest.service'])
        );
    }

    public function prepareQuoteRequest(Request $request, Appointment $appointment)
    {
        $this->ensureAdmin($request);

        abort_unless(
            $appointment->status === 'completed',
            422,
            'Le rendez-vous doit être terminé avant de créer le devis final.'
        );

        $this->attachQuoteRequest($appointment);

        return AppointmentResource::make(
            $appointment->fresh()->load(['quoteRequest.service'])
        );
    }

    private function attachQuoteRequest(Appointment $appointment): void
    {
        if ($appointment->quote_request_id) {
            return;
        }

        $quoteRequest = QuoteRequest::create([
            'client_id' => null,
            'first_name' => $appointment->first_name,
            'last_name' => $appointment->last_name,
            'phone' => $appointment->phone,
            'email' => $appointment->email,
            'city' => $appointment->city,
            'address' => $appointment->address,
            'description' => $appointment->notes ?? 'Première consultation prise directement.',
            'status' => 'new',
        ]);

        $appointment->update(['quote_request_id' => $quoteRequest->id]);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');
    }

}
