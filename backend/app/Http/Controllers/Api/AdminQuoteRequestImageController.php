<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequestImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminQuoteRequestImageController extends Controller
{
    public function show(Request $request, QuoteRequestImage $quoteRequestImage)
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');

        abort_unless(
            Storage::disk($quoteRequestImage->disk)->exists($quoteRequestImage->path),
            404,
            'Image introuvable.'
        );

        return Storage::disk($quoteRequestImage->disk)->response($quoteRequestImage->path);
    }
}
