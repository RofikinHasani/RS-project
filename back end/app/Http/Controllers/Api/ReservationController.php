<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * GET /api/reservations — current user's reservations.
     */
    public function index(Request $request)
    {
        $reservations = $request->user()->reservations()->latest()->get();

        return response()->json($reservations);
    }

    /**
     * POST /api/reservations — matches the Reservation.jsx form fields.
     * `booking_ref` is generated here, not by the client.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'phone' => ['required', 'string', 'min:7', 'max:20'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'guests' => ['required', 'string', 'max:50'],
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $reservation = $request->user()->reservations()->create([
            'booking_ref' => $this->generateBookingRef(),
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'guests' => $data['guests'],
            'date' => $data['date'],
            'time' => $data['time'],
            'note' => $data['note'] ?? null,
            'status' => 'confirmed',
        ]);

        return response()->json($reservation, 201);
    }

    private function generateBookingRef(): string
    {
        do {
            $ref = 'RSV-'.random_int(100000, 999999);
        } while (Reservation::where('booking_ref', $ref)->exists());

        return $ref;
    }
}
