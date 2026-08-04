<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    const TAX_RATE = 0.10;

    /**
     * GET /api/orders — current user's orders (with items).
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * POST /api/orders — {items:[{menu_item_id, quantity}]} -> order.
     * Prices/subtotal/tax/total are always computed here from the
     * current DB price — never trusted from the client.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $menuItems = MenuItem::whereIn('id', collect($data['items'])->pluck('menu_item_id'))
            ->get()
            ->keyBy('id');

        $order = DB::transaction(function () use ($data, $menuItems, $request) {
            $subtotal = 0;
            $lines = [];

            foreach ($data['items'] as $line) {
                $menuItem = $menuItems[$line['menu_item_id']];
                $lineTotal = $menuItem->price * $line['quantity'];
                $subtotal += $lineTotal;

                $lines[] = [
                    'menu_item_id' => $menuItem->id,
                    'name' => $menuItem->name,
                    'price' => $menuItem->price,
                    'quantity' => $line['quantity'],
                ];
            }

            $tax = round($subtotal * self::TAX_RATE, 2);
            $total = round($subtotal + $tax, 2);

            $order = $request->user()->orders()->create([
                'order_no' => $this->generateOrderNo(),
                'subtotal' => round($subtotal, 2),
                'tax' => $tax,
                'total' => $total,
                'status' => 'placed',
            ]);

            $order->items()->createMany($lines);

            return $order;
        });

        return response()->json($order->load('items'), 201);
    }

    private function generateOrderNo(): string
    {
        do {
            $orderNo = (string) random_int(100000, 999999);
        } while (Order::where('order_no', $orderNo)->exists());

        return $orderNo;
    }
}
