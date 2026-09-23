<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Quote;
use App\Notifications\ProjectStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class AdminProjectController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $projects = Project::query()
            ->with('quote')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->latest()
            ->paginate(20);

        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request, Quote $quote)
    {
        $this->ensureAdmin($request);

        if ($quote->status !== 'accepted') {
            throw ValidationException::withMessages([
                'quote' => ['Le devis doit être accepté avant la création du projet.'],
            ]);
        }

        if ($quote->project()->exists()) {
            throw ValidationException::withMessages([
                'quote' => ['Un projet existe déjà pour ce devis.'],
            ]);
        }

        $data = $request->validated();
        $project = $quote->project()->create([
            'title' => $data['title'] ?? "Projet {$quote->quote_number}",
            'description' => $data['description'] ?? null,
            'status' => 'planning',
            'start_date' => $data['start_date'] ?? null,
            'expected_completion_date' => $data['expected_completion_date'] ?? null,
            'admin_notes' => $data['admin_notes'] ?? null,
        ]);

        return ProjectResource::make($project->load('quote'))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Project $project)
    {
        $this->ensureAdmin($request);

        return ProjectResource::make($project->load('quote'));
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->ensureAdmin($request);

        $data = $request->validated();
        $previousStatus = $project->status;
        if (($data['status'] ?? null) === 'completed') {
            $data['completed_at'] = now();
        }

        $project->update($data);

        if (isset($data['status']) && $data['status'] !== $previousStatus) {
            $project->load('quote.quoteRequest');
            $email = $project->quote?->quoteRequest?->email;

            if ($email) {
                Notification::route('mail', $email)
                    ->notify(new ProjectStatusUpdated($project));
            }
        }

        return ProjectResource::make($project->load('quote'));
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');
    }
}
