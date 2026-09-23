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

        return response()->json([
            'data' => [
                'quote_requests' => [
                    'total' => QuoteRequest::count(),
                    'new' => QuoteRequest::where('status', 'new')->count(),
                    'contacted' => QuoteRequest::where('status', 'contacted')->count(),
                ],
                'appointments' => [
                    'total' => Appointment::count(),
                    'requested' => Appointment::where('status', 'requested')->count(),
                    'confirmed' => Appointment::where('status', 'confirmed')->count(),
                ],
                'quotes' => [
                    'total' => Quote::count(),
                    'draft' => Quote::where('status', 'draft')->count(),
                    'sent' => Quote::where('status', 'sent')->count(),
                    'accepted' => Quote::where('status', 'accepted')->count(),
                    'accepted_total_tnd' => (float) Quote::where('status', 'accepted')->sum('total'),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'planning' => Project::where('status', 'planning')->count(),
                    'in_progress' => Project::where('status', 'in_progress')->count(),
                    'installation' => Project::where('status', 'installation')->count(),
                    'completed' => Project::where('status', 'completed')->count(),
                ],
            ],
        ]);
    }
}
