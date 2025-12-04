<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Listing;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Get all orders for the authenticated buyer
     */
    public function index(Request $request)
    {
        try {
            $orders = Order::with(['seller', 'listing'])
                ->where('buyer_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            // Transform listing image URLs to full URLs
            $orders->getCollection()->transform(function ($order) {
                if ($order->listing && $order->listing->image_url) {
                    if (!str_starts_with($order->listing->image_url, 'http')) {
                        $order->listing->image_url = url($order->listing->image_url);
                    }
                }
                return $order;
            });

            return response()->json([
                'success' => true,
                'data' => $orders,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get orders received by the authenticated seller
     */
    public function sellerOrders(Request $request)
    {
        try {
            $orders = Order::with(['buyer', 'listing'])
                ->where('seller_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            // Transform listing image URLs to full URLs
            $orders->getCollection()->transform(function ($order) {
                if ($order->listing && $order->listing->image_url) {
                    if (!str_starts_with($order->listing->image_url, 'http')) {
                        $order->listing->image_url = url($order->listing->image_url);
                    }
                }
                return $order;
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'orders' => $orders->items(),
                    'pagination' => [
                        'total' => $orders->total(),
                        'per_page' => $orders->perPage(),
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage(),
                    ]
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch seller orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single order by ID
     */
    public function show(Request $request, $id)
    {
        try {
            $order = Order::with(['buyer', 'seller', 'listing'])->findOrFail($id);

            // Check if the user is the buyer or seller
            if ($order->buyer_id !== $request->user()->id && $order->seller_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            // Transform listing image URL to full URL
            if ($order->listing && $order->listing->image_url) {
                if (!str_starts_with($order->listing->image_url, 'http')) {
                    $order->listing->image_url = url($order->listing->image_url);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $order,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:20',
            'payment_method' => 'required|in:cod,agribidpay,gcash,paylater',
            'delivery_method' => 'required|in:deliver,pickup',
            'pickup_notes' => 'nullable|string|max:500',
            'message_for_seller' => 'nullable|string|max:500',
            'voucher_code' => 'nullable|string|max:50',
            'price_per_unit' => 'required|numeric|min:0',
            'calculated_subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Get the listing and calculate pricing
            $listing = Listing::findOrFail($validated['listing_id']);
            
            // Check if listing uses stock batch management
            $usesBatchManagement = $listing->stockBatches()->exists();
            
            if ($usesBatchManagement) {
                // For batch-managed listings, check total available quantity across all batches
                $availableQuantity = $listing->total_available_quantity;
                
                if ($availableQuantity < $validated['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Insufficient stock available',
                    ], 400);
                }
                
                // Deduct stock using FIFO method
                if (!$listing->deductStock($validated['quantity'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to deduct stock from batches',
                    ], 500);
                }
            } else {
                // For non-batch listings, check main quantity
                if ($listing->quantity < $validated['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Insufficient stock available',
                    ], 400);
                }
                
                // Update listing quantity directly
                $listing->quantity -= $validated['quantity'];
                $listing->save();
            }

            // Use pricing calculated by frontend (includes tiered pricing logic)
            $pricePerUnit = $validated['price_per_unit'];
            $subtotal = $validated['calculated_subtotal'];
            $shippingFee = $validated['shipping_fee'];
            $totalAmount = $validated['total_amount'];
            $discount = 0; // No automatic discount

            // Get user's delivery address
            $user = $request->user();

            // Create the order
            $order = Order::create([
                'buyer_id' => $user->id,
                'seller_id' => $listing->user_id,
                'listing_id' => $listing->id,
                'quantity' => $validated['quantity'],
                'unit' => $validated['unit'],
                'price_per_unit' => $pricePerUnit,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount' => $discount,
                'total_amount' => $totalAmount,
                'delivery_name' => $user->name,
                'delivery_phone' => $user->phone ?? '',
                'delivery_street_address' => $user->street_address ?? '',
                'delivery_barangay' => $user->barangay ?? '',
                'delivery_city' => $user->city ?? '',
                'delivery_province' => $user->province ?? '',
                'delivery_postal_code' => $user->postal_code ?? '',
                'payment_method' => $validated['payment_method'],
                'delivery_method' => $validated['delivery_method'],
                'pickup_notes' => $validated['pickup_notes'] ?? null,
                'shipping_option' => 'standard',
                'estimated_delivery_start' => Carbon::now()->addDays(3),
                'estimated_delivery_end' => Carbon::now()->addDays(7),
                'status' => 'pending',
                'message_for_seller' => $validated['message_for_seller'] ?? null,
                'voucher_code' => $validated['voucher_code'] ?? null,
            ]);

            // Note: Stock already deducted above based on batch management type

            // Create notifications for both buyer and seller
            Notification::create([
                'user_id' => $user->id, // Buyer notification
                'type' => 'order_placed',
                'title' => 'Order Placed Successfully',
                'message' => "Your order for {$listing->name} has been placed. Order #" . $order->id,
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $listing->user_id, // Seller notification
                'type' => 'new_order',
                'title' => 'New Order Received',
                'message' => "{$user->name} ordered {$validated['quantity']} {$validated['unit']} of {$listing->name}. Order #" . $order->id,
                'read' => false,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order->load(['buyer', 'seller', 'listing']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded',
            'cancellation_reason' => 'required_if:status,cancelled|string|max:500',
        ]);

        try {
            $order = Order::findOrFail($id);

            // Check if the user is the seller or buyer
            if ($order->seller_id !== $request->user()->id && $order->buyer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this order',
                ], 403);
            }

            $order->status = $validated['status'];

            // Update timestamps based on status
            switch ($validated['status']) {
                case 'confirmed':
                    $order->confirmed_at = Carbon::now();
                    break;
                case 'shipped':
                    $order->shipped_at = Carbon::now();
                    break;
                case 'delivered':
                    $order->delivered_at = Carbon::now();
                    break;
                case 'cancelled':
                    $order->cancelled_at = Carbon::now();
                    $order->cancellation_reason = $validated['cancellation_reason'] ?? null;
                    
                    // Restore listing quantity if cancelled
                    $listing = $order->listing;
                    $listing->quantity += $order->quantity;
                    $listing->save();
                    break;
            }

            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->load(['buyer', 'seller', 'listing']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel an order (buyer only)
     */
    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        try {
            $order = Order::findOrFail($id);

            // Only buyer can cancel and only if order is pending or confirmed
            if ($order->buyer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the buyer can cancel this order',
                ], 403);
            }

            if (!in_array($order->status, ['pending', 'confirmed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order cannot be cancelled at this stage',
                ], 400);
            }

            DB::beginTransaction();

            $order->status = 'cancelled';
            $order->cancelled_at = Carbon::now();
            $order->cancellation_reason = $validated['cancellation_reason'];
            $order->save();

            // Restore listing quantity
            $listing = $order->listing;
            $listing->quantity += $order->quantity;
            $listing->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'data' => $order->load(['buyer', 'seller', 'listing']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
