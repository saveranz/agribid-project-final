<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuctionPayment;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuctionPaymentController extends Controller
{
    /**
     * Record a payment for an auction bid
     */
    public function recordPayment(Request $request)
    {
        $validated = $request->validate([
            'bid_id' => 'required|exists:bids,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_type' => 'required|in:downpayment,partial,final,full',
            'payment_method' => 'required|in:cod,agribidpay,gcash,bank_transfer,cash,card',
            'confirmation_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'payment_deadline' => 'nullable|date',
        ]);

        try {
            DB::beginTransaction();

            $bid = Bid::with('listing')->findOrFail($validated['bid_id']);

            // Verify the user is the SELLER (farmer) who owns this listing
            if ($bid->listing->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Only the seller can record payments'
                ], 403);
            }

            // Get buyer_id from bid
            $buyerId = $bid->buyer_id;
            
            // Map 'card' to 'gcash' if needed (table doesn't have 'card' option)
            $paymentMethod = $validated['payment_method'];
            if ($paymentMethod === 'card') {
                $paymentMethod = 'gcash';
            }

            // Create payment record
            $payment = AuctionPayment::create([
                'bid_id' => $validated['bid_id'],
                'buyer_id' => $buyerId,
                'seller_id' => $request->user()->id,
                'listing_id' => $bid->listing_id,
                'amount' => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'payment_method' => $paymentMethod,
                'payment_reference' => $validated['confirmation_id'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'verified',
                'payment_date' => now(),
                'verified_at' => now(),
                'verified_by' => $request->user()->id,
            ]);

            // Update bid payment status
            $bid->total_paid += $validated['amount'];
            $bid->remaining_balance = ($bid->winning_bid_amount ?? $bid->bid_amount) - $bid->total_paid;

            if ($validated['payment_type'] === 'downpayment') {
                $bid->downpayment_amount = $validated['amount'];
                $bid->payment_status = 'partial';
                $bid->fulfillment_status = 'pending';
                // Set payment deadline if provided
                if (isset($validated['payment_deadline'])) {
                    $bid->payment_deadline = $validated['payment_deadline'];
                }
            } elseif ($bid->remaining_balance <= 0) {
                $bid->payment_status = 'paid';
                $bid->full_payment_date = now();
                $bid->fulfillment_status = 'ready_for_pickup';
                $bid->remaining_balance = 0;
                $bid->payment_deadline = null; // Clear deadline when fully paid
            } else {
                $bid->payment_status = 'partial';
                // Update payment deadline if provided for balance payment
                if (isset($validated['payment_deadline'])) {
                    $bid->payment_deadline = $validated['payment_deadline'];
                }
            }

            $bid->save();
            
            // Invalidate cache for both buyer and seller
            cache()->forget("bids_user_{$buyerId}");

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data' => [
                    'payment' => $payment,
                    'bid' => $bid->fresh()->load(['listing', 'payments'])
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to record payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment history for a bid
     */
    public function getPaymentHistory(Request $request, $bidId)
    {
        try {
            $bid = Bid::with(['listing', 'buyer', 'payments'])->findOrFail($bidId);

            // Verify access
            $userId = $request->user()->id;
            $isOwner = $bid->buyer_id === $userId || $bid->listing->user_id === $userId;

            if (!$isOwner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'bid' => $bid,
                    'payments' => $bid->payments()->orderBy('created_at', 'desc')->get()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all auction payments for seller (farmer dashboard)
     */
    public function getSellerPayments(Request $request)
    {
        try {
            $payments = AuctionPayment::with(['bid.listing', 'buyer'])
                ->where('seller_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            $bids = Bid::with(['listing', 'buyer', 'payments'])
                ->whereHas('listing', function($query) use ($request) {
                    $query->where('user_id', $request->user()->id);
                })
                ->where('is_winning', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'payments' => $payments,
                    'winning_bids' => $bids
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch seller payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
