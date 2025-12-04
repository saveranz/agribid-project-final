<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    use ApiResponses;

    /**
     * Display user's orders.
     */
    public function index()
    {
        $userId = Auth::id();
        $cacheKey = "orders_user_{$userId}";
        
        // Cache for 30 seconds
        $transactions = cache()->remember($cacheKey, 30, function () {
            return Transaction::with(['listing:id,title,unit,image_url', 'seller:id,name'])
                ->where('buyer_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
        });

        $transactions = $transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'productName' => $transaction->listing->title ?? 'Product',
                'seller' => $transaction->seller->name ?? 'Unknown',
                'quantity' => $transaction->quantity . ' ' . ($transaction->listing->unit ?? 'kg'),
                'totalPrice' => '₱' . number_format($transaction->total_amount, 2),
                'status' => ucfirst($transaction->status),
                'orderDate' => $transaction->created_at->format('M d, Y'),
                'deliveryDate' => $transaction->delivery_date ? date('M d, Y', strtotime($transaction->delivery_date)) : null,
                'expectedDelivery' => $transaction->expected_delivery_date ? date('M d, Y', strtotime($transaction->expected_delivery_date)) : null,
                'image' => $transaction->listing->image_url ?? 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
            ];
        });

        return $this->success($transactions, 'Orders retrieved successfully');
    }

    /**
     * Create a new buy now transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'quantity' => 'required|numeric|min:1',
            'delivery_address' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $listing = Listing::findOrFail($request->listing_id);

        // Check if listing has buy now price
        if (!$listing->buy_now_price) {
            return $this->error('This listing does not have a buy now option', 400);
        }

        // Check if buyer is not the seller
        if ($listing->user_id === Auth::id()) {
            return $this->error('You cannot buy your own listing', 403);
        }

        DB::beginTransaction();
        try {
            // Check if enough stock is available
            if ($listing->quantity < $request->quantity) {
                return $this->error('Insufficient stock available. Only ' . $listing->quantity . ' ' . $listing->unit . ' available.', 400);
            }

            // Calculate total amount
            $totalAmount = $listing->buy_now_price * $request->quantity;

            // Deduct stock from listing
            if (!$listing->deductStock($request->quantity)) {
                DB::rollBack();
                return $this->error('Failed to deduct stock. Please try again.', 500);
            }

            // Create transaction
            $transaction = Transaction::create([
                'listing_id' => $listing->id,
                'buyer_id' => Auth::id(),
                'seller_id' => $listing->farmer_id,
                'quantity' => $request->quantity,
                'unit_price' => $listing->buy_now_price,
                'total_amount' => $totalAmount,
                'delivery_address' => $request->delivery_address,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'expected_delivery_date' => now()->addDays(3),
            ]);

            DB::commit();

            // Clear user's order cache
            cache()->forget("orders_user_{$request->user()->id}");

            return $this->success([
                'transaction_id' => $transaction->id,
                'product_name' => $listing->title,
                'quantity' => $request->quantity,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'expected_delivery' => $transaction->expected_delivery_date->format('M d, Y'),
            ], 'Order placed successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified transaction.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with(['listing', 'seller', 'buyer'])
            ->where('buyer_id', Auth::id())
            ->findOrFail($id);

        return $this->success([
            'id' => $transaction->id,
            'listing' => [
                'id' => $transaction->listing->id,
                'title' => $transaction->listing->title,
                'image_url' => $transaction->listing->image_url,
            ],
            'seller' => [
                'id' => $transaction->seller->id,
                'name' => $transaction->seller->name,
            ],
            'quantity' => $transaction->quantity,
            'unit_price' => $transaction->unit_price,
            'total_amount' => $transaction->total_amount,
            'delivery_address' => $transaction->delivery_address,
            'payment_method' => $transaction->payment_method,
            'status' => $transaction->status,
            'created_at' => $transaction->created_at->format('M d, Y H:i'),
            'expected_delivery_date' => $transaction->expected_delivery_date?->format('M d, Y'),
            'delivery_date' => $transaction->delivery_date?->format('M d, Y'),
        ], 'Transaction details retrieved successfully');
    }
}
