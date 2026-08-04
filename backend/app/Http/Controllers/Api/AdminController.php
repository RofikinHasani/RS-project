<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * GET /api/admin/stats — summary numbers for the dashboard cards.
     */
    public function stats()
    {
        return response()->json([
            'total_customers' => User::where('is_admin', false)->count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::sum('total'),
            'total_reservations' => Reservation::count(),
            'upcoming_reservations' => Reservation::where('status', 'confirmed')
                ->whereDate('date', '>=', now()->toDateString())
                ->count(),
            'orders_today' => Order::whereDate('created_at', now()->toDateString())->count(),
            'total_menu_items' => MenuItem::count(),
        ]);
    }

    /**
     * GET /api/admin/orders — every order, newest first, with the
     * customer's name/email and line items attached.
     */
    public function orders()
    {
        $orders = Order::with(['items', 'user:id,name,email'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * PATCH /api/admin/orders/{order} — update an order's status.
     */
    public function updateOrderStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['placed', 'preparing', 'completed', 'cancelled'])],
        ]);

        $order->update($data);

        return response()->json($order->load(['items', 'user:id,name,email']));
    }

    /**
     * GET /api/admin/reservations — every reservation, newest first,
     * with the customer's name/email attached.
     */
    public function reservations()
    {
        $reservations = Reservation::with('user:id,name,email')
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    /**
     * PATCH /api/admin/reservations/{reservation} — update a
     * reservation's status (confirm / cancel).
     */
    public function updateReservationStatus(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['confirmed', 'cancelled'])],
        ]);

        $reservation->update($data);

        return response()->json($reservation->load('user:id,name,email'));
    }

    /**
     * GET /api/admin/menu-items — every dish, including non-featured
     * ones, for the admin menu manager (the public endpoint is the
     * same table but this one is the one the admin UI edits from).
     */
    public function menuItems()
    {
        return response()->json(MenuItem::orderBy('category')->orderBy('name')->get());
    }

    /**
     * POST /api/admin/menu-items — add a new dish.
     */
    public function storeMenuItem(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['breakfast', 'lunch', 'dinner', 'dessert', 'drink', 'specialty', 'seafood'])],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'photo_url' => ['nullable', 'string', 'max:2048'],
            'featured' => ['boolean'],
        ]);

        $menuItem = MenuItem::create($data);

        return response()->json($menuItem, 201);
    }

    /**
     * PUT /api/admin/menu-items/{menuItem} — edit a dish.
     */
    public function updateMenuItem(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', Rule::in(['breakfast', 'lunch', 'dinner', 'dessert', 'drink', 'specialty', 'seafood'])],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'photo_url' => ['nullable', 'string', 'max:2048'],
            'featured' => ['boolean'],
        ]);

        $menuItem->update($data);

        return response()->json($menuItem);
    }

    /**
     * DELETE /api/admin/menu-items/{menuItem} — remove a dish. Past
     * orders keep the dish name/price as a snapshot (see OrderItem),
     * so deleting it here doesn't corrupt order history.
     */
    public function destroyMenuItem(MenuItem $menuItem)
    {
        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted.']);
    }

    /**
     * GET /api/admin/customers — every registered customer (not
     * admins), with their order and reservation counts.
     */
    public function customers()
    {
        $customers = User::where('is_admin', false)
            ->withCount(['orders', 'reservations'])
            ->latest()
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json($customers);
    }
}
