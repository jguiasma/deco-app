<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicServiceController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\PublicQuoteRequestController;
use App\Http\Controllers\Api\AdminQuoteRequestController;
use App\Http\Controllers\Api\AdminServicePricingRuleController;
use App\Http\Controllers\Api\PublicEstimateController;
use App\Http\Controllers\Api\PublicAppointmentController;
use App\Http\Controllers\Api\AdminAppointmentController;
use App\Http\Controllers\Api\AdminQuoteRequestImageController;
use App\Http\Controllers\Api\AdminQuoteController;
use App\Http\Controllers\Api\AdminProjectController;
use App\Http\Controllers\Api\AdminDashboardController;
Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'message' => 'API Ben Wada Déco fonctionne',
]));

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/quote-requests', [AdminQuoteRequestController::class, 'index']);
        Route::patch('/quote-requests/{quoteRequest}', [AdminQuoteRequestController::class, 'update']);
        Route::get('/quote-request-images/{quoteRequestImage}', [AdminQuoteRequestImageController::class, 'show'])
            ->name('admin.quote-request-images.show');
        Route::apiResource('quotes', AdminQuoteController::class)
            ->only(['index', 'store', 'show', 'update']);
        Route::get('/quotes/{quote}/pdf', [AdminQuoteController::class, 'pdf']);
        Route::post('/quotes/{quote}/project', [AdminProjectController::class, 'store']);
        Route::apiResource('projects', AdminProjectController::class)
            ->only(['index', 'show', 'update']);
        Route::get('/appointments', [AdminAppointmentController::class, 'index']);
        Route::post('/appointments', [AdminAppointmentController::class, 'store']);
        Route::patch('/appointments/{appointment}', [AdminAppointmentController::class, 'update']);
        Route::apiResource('pricing-rules', AdminServicePricingRuleController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });
});
Route::get('/services', [PublicServiceController::class, 'index']);
Route::get('/products', [PublicProductController::class, 'index']);
Route::post('/quote-requests', [PublicQuoteRequestController::class, 'store']);
Route::post('/estimates', [PublicEstimateController::class, 'store']);
Route::post('/appointments', [PublicAppointmentController::class, 'store']);
