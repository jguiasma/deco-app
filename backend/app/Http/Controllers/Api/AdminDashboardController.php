<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Project;
use App\Models\Quote;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');

        $monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        $monthlyActivity = collect(range(5, 0))->map(function (int $monthsAgo) use ($monthLabels) {
            $month = now()->subMonths($monthsAgo);

            return [
                'label' => $monthLabels[$month->month - 1],
                'rendez_vous' => Appointment::query()
                    ->whereBetween('scheduled_at', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                    ->count(),
                'devis' => Quote::query()
                    ->whereBetween('created_at', [$month->copy()->startOfMonth(), $month->copy()->endOfMonth()])
                    ->count(),
            ];
        })->values();

        return response()->json([
            'data' => [
                'quote_requests' => [
                    'total' => QuoteRequest::count(),
                    'new' => QuoteRequest::where('status', 'new')->count(),
                    'contacted' => QuoteRequest::where('status', 'contacted')->count(),
                ],
                'appointments' => [
                    'total' => Appointment::count(),
                    'this_month' => Appointment::query()
                        ->whereBetween('scheduled_at', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count(),
                    'requested' => Appointment::where('status', 'requested')->count(),
                    'confirmed' => Appointment::where('status', 'confirmed')->count(),
                ],
                'quotes' => [
                    'total' => Quote::count(),
                    'draft' => Quote::where('status', 'draft')->count(),
                    'sent' => Quote::where('status', 'sent')->count(),
                    'accepted' => Quote::where('status', 'accepted')->count(),
                    'rejected' => Quote::where('status', 'rejected')->count(),
                    'accepted_total_tnd' => (float) Quote::where('status', 'accepted')->sum('total'),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'planning' => Project::where('status', 'planning')->count(),
                    'in_progress' => Project::where('status', 'in_progress')->count(),
                    'installation' => Project::where('status', 'installation')->count(),
                    'ongoing' => Project::whereIn('status', ['planning', 'in_progress', 'installation'])->count(),
                    'completed' => Project::where('status', 'completed')->count(),
                ],
                'charts' => [
                    'monthly_activity' => $monthlyActivity,
                    'projects_by_stage' => [
                        ['label' => 'Préparation', 'total' => Project::where('status', 'planning')->count()],
                        ['label' => 'Travaux', 'total' => Project::where('status', 'in_progress')->count()],
                        ['label' => 'Installation', 'total' => Project::where('status', 'installation')->count()],
                        ['label' => 'Terminé', 'total' => Project::where('status', 'completed')->count()],
                    ],
                ],
            ],
        ]);
    }
}
