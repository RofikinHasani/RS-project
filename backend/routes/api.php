<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Matches src/lib/api.js in the React frontend exactly.
|
*/

// --- Public ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/menu-items', [MenuItemController::class, 'index']);

// --- Authenticated (Sanctum bearer token) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
});

// --- Admin only (same /login endpoint issues the token; this just
// requires the authenticated user to have is_admin = true) ---
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);

    Route::get('/orders', [AdminController::class, 'orders']);
    Route::patch('/orders/{order}', [AdminController::class, 'updateOrderStatus']);

    Route::get('/reservations', [AdminController::class, 'reservations']);
    Route::patch('/reservations/{reservation}', [AdminController::class, 'updateReservationStatus']);

    Route::get('/menu-items', [AdminController::class, 'menuItems']);
    Route::post('/menu-items', [AdminController::class, 'storeMenuItem']);
    Route::put('/menu-items/{menuItem}', [AdminController::class, 'updateMenuItem']);
    Route::delete('/menu-items/{menuItem}', [AdminController::class, 'destroyMenuItem']);

    Route::get('/customers', [AdminController::class, 'customers']);
});
