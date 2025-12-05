<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with(['listing' => function($query) {
                $query->with(['user', 'category']);
            }])
            ->get();

        return $this->success('Cart items retrieved successfully', $cartItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string',
            'price' => 'required|numeric|min:0'
        ]);

        // Check if item already exists in cart
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('listing_id', $request->listing_id)
            ->first();

        if ($existingCartItem) {
            // Update quantity if item exists
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();

            $cartItem = Cart::with(['listing' => function($query) {
                $query->with(['user', 'category']);
            }])->find($existingCartItem->id);

            return $this->success('Cart item quantity updated successfully', $cartItem);
        }

        // Create new cart item
        $cartItem = Cart::create([
            'user_id' => Auth::id(),
            'listing_id' => $request->listing_id,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'price' => $request->price
        ]);

        $cartItem = Cart::with(['listing' => function($query) {
            $query->with(['user', 'category']);
        }])->find($cartItem->id);

        return $this->success('Item added to cart successfully', $cartItem, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        $cartItem = Cart::with(['listing' => function($query) {
            $query->with(['user', 'category']);
        }])->find($cartItem->id);

        return $this->success('Cart item updated successfully', $cartItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if ($id === 'all') {
            // Clear entire cart
            Cart::where('user_id', Auth::id())->delete();
            return $this->success('Cart cleared successfully');
        }

        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return $this->success('Item removed from cart successfully');
    }
}
