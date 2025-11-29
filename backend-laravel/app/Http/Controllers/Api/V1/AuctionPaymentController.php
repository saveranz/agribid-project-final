<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuctionPayment;
use App\Models\Bid;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AuctionPaymentController extends Controller
{
    use ApiResponses;

    /**
     * Submit a new payment for a winning bid
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bid_id' => 'required|exists:bids,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_type' => ['required', Rule::in(['downpayment', 'partial', 'final', 'full'])],
            'payment_method' => ['required', Rule::in(['cod', 'agribidpay', 'gcash', 'bank_transfer', 'cash'])],
            'payment_reference' => 'nullable|string|max:255',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
            'notes' => 'nullable|string|max:500',
        ]);

        // Verify the bid belongs to the authenticated buyer and is a winning bid
        $bid = Bid::with('listing')->findOrFail($validated['bid_id']);
        
        if ($bid->user_id !== Auth::id()) {
            return $this->error('Unauthorized', 'You can only make payments for your own bids', 403);
        }

        if (!$bid->is_winning) {
            return $this->error('Invalid bid', 'Only winning bids can receive payments', 400);
        }

        // Check if payment amount is valid
        if ($validated['amount'] > $bid->remaining_balance) {
            return $this->error('Invalid amount', 'Payment amount exceeds remaining balance', 400);
        }

        // Validate minimum downpayment if this is the first payment
        if ($bid->payment_status === 'unpaid' && $validated['payment_type'] === 'downpayment') {
            if ($validated['amount'] < $bid->minimum_downpayment) {
                return $this->error(
                    'Insufficient downpayment',
                    "Minimum downpayment is ₱" . number_format($bid->minimum_downpayment, 2),
                    400
                );
            }
        }

        DB::beginTransaction();
        try {
            // Handle payment proof upload
            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            }

            // Create payment record
            $payment = AuctionPayment::create([
                'bid_id' => $bid->id,
                'buyer_id' => Auth::id(),
                'seller_id' => $bid->listing->user_id,
                'listing_id' => $bid->listing_id,
                'amount' => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'payment_method' => $validated['payment_method'],
                'payment_reference' => $validated['payment_reference'] ?? null,
                'payment_proof' => $paymentProofPath,
                'status' => 'pending', // Awaiting seller verification
                'notes' => $validated['notes'] ?? null,
                'payment_date' => now(),
            ]);

            // Create notification for seller
            $bid->listing->user->notify(new \App\Notifications\NewPaymentReceived($payment));

            DB::commit();

            return $this->success([
                'payment' => $payment->load(['buyer', 'seller', 'listing']),
                'message' => 'Payment submitted successfully. Awaiting seller verification.'
            ], 'Payment submitted', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Delete uploaded file if transaction failed
            if ($paymentProofPath) {
                Storage::disk('public')->delete($paymentProofPath);
            }

            return $this->error('Payment failed', $e->getMessage(), 500);
        }
    }

    /**
     * Get all payments for a specific bid
     */
    public function getByBid($bidId)
    {
        $bid = Bid::with('listing')->findOrFail($bidId);

        // Only buyer, seller, or admin can view payments
        if ($bid->user_id !== Auth::id() && 
            $bid->listing->user_id !== Auth::id() && 
            !Auth::user()->hasRole('admin')) {
            return $this->error('Unauthorized', 'You cannot view these payments', 403);
        }

        $payments = AuctionPayment::where('bid_id', $bidId)
            ->with(['buyer', 'seller', 'verifier'])
            ->orderBy('payment_date', 'desc')
            ->get();

        return $this->success([
            'bid' => $bid,
            'payments' => $payments,
            'summary' => [
                'winning_bid_amount' => $bid->winning_bid_amount,
                'total_paid' => $bid->total_paid,
                'remaining_balance' => $bid->remaining_balance,
                'payment_status' => $bid->payment_status,
                'payment_deadline' => $bid->payment_deadline,
                'is_overdue' => $bid->payment_deadline && now()->gt($bid->payment_deadline) && $bid->payment_status !== 'paid',
            ]
        ]);
    }

    /**
     * Get buyer's payment history across all auctions
     */
    public function getBuyerPayments(Request $request)
    {
        $query = AuctionPayment::where('buyer_id', Auth::id())
            ->with(['listing', 'seller', 'bid']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment type
        if ($request->has('payment_type')) {
            $query->where('payment_type', $request->payment_type);
        }

        $payments = $query->orderBy('payment_date', 'desc')->paginate(15);

        return $this->success($payments);
    }

    /**
     * Get seller's received payments and pending verifications
     */
    public function getSellerPayments(Request $request)
    {
        $query = AuctionPayment::where('seller_id', Auth::id())
            ->with(['listing', 'buyer', 'bid']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Default to showing pending verifications first
        $payments = $query->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        // Get summary stats
        $stats = [
            'pending_verifications' => AuctionPayment::where('seller_id', Auth::id())
                ->where('status', 'pending')
                ->count(),
            'total_verified' => AuctionPayment::where('seller_id', Auth::id())
                ->where('status', 'verified')
                ->sum('amount'),
            'pending_amount' => AuctionPayment::where('seller_id', Auth::id())
                ->where('status', 'pending')
                ->sum('amount'),
        ];

        return $this->success([
            'payments' => $payments,
            'stats' => $stats,
        ]);
    }

    /**
     * Verify or reject a payment (seller/admin only)
     */
    public function verify(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['verified', 'rejected'])],
            'notes' => 'nullable|string|max:500',
            'rejection_reason' => 'required_if:status,rejected|string|max:500',
        ]);

        $payment = AuctionPayment::with(['bid', 'listing'])->findOrFail($id);

        // Only seller or admin can verify
        if ($payment->seller_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            return $this->error('Unauthorized', 'Only the seller or admin can verify payments', 403);
        }

        if ($payment->status !== 'pending') {
            return $this->error('Invalid status', 'This payment has already been processed', 400);
        }

        DB::beginTransaction();
        try {
            // Update payment status
            $payment->update([
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? $payment->notes,
                'rejection_reason' => $validated['rejection_reason'] ?? null,
                'verified_at' => $validated['status'] === 'verified' ? now() : null,
                'verified_by' => Auth::id(),
            ]);

            // If verified, update bid payment tracking
            if ($validated['status'] === 'verified') {
                $payment->bid->updatePaymentStatus();
            }

            // Notify buyer
            $payment->buyer->notify(
                $validated['status'] === 'verified' 
                    ? new \App\Notifications\PaymentVerified($payment)
                    : new \App\Notifications\PaymentRejected($payment)
            );

            DB::commit();

            return $this->success([
                'payment' => $payment->fresh()->load(['buyer', 'seller', 'verifier', 'bid']),
                'message' => $validated['status'] === 'verified' 
                    ? 'Payment verified successfully' 
                    : 'Payment rejected'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Verification failed', $e->getMessage(), 500);
        }
    }

    /**
     * Get single payment details
     */
    public function show($id)
    {
        $payment = AuctionPayment::with(['buyer', 'seller', 'listing', 'bid', 'verifier'])
            ->findOrFail($id);

        // Authorization check
        if ($payment->buyer_id !== Auth::id() && 
            $payment->seller_id !== Auth::id() && 
            !Auth::user()->hasRole('admin')) {
            return $this->error('Unauthorized', 'You cannot view this payment', 403);
        }

        return $this->success($payment);
    }

    /**
     * Get payment transparency card data for a specific bid
     */
    public function getPaymentStatus($bidId)
    {
        $bid = Bid::with(['listing', 'user'])->findOrFail($bidId);

        // Authorization check
        if ($bid->user_id !== Auth::id() && 
            $bid->listing->user_id !== Auth::id() && 
            !Auth::user()->hasRole('admin')) {
            return $this->error('Unauthorized', 'You cannot view this payment status', 403);
        }

        $payments = AuctionPayment::where('bid_id', $bidId)
            ->verified()
            ->orderBy('payment_date', 'asc')
            ->get();

        $pendingPayments = AuctionPayment::where('bid_id', $bidId)
            ->pending()
            ->get();

        $isOverdue = $bid->payment_deadline && 
                     now()->gt($bid->payment_deadline) && 
                     $bid->payment_status !== 'paid';

        $daysUntilDeadline = $bid->payment_deadline 
            ? now()->diffInDays($bid->payment_deadline, false) 
            : null;

        return $this->success([
            'bid_id' => $bid->id,
            'listing' => [
                'id' => $bid->listing->id,
                'title' => $bid->listing->title,
                'image' => $bid->listing->image_url,
            ],
            'buyer' => [
                'id' => $bid->user->id,
                'name' => $bid->user->name,
            ],
            'seller' => [
                'id' => $bid->listing->user->id,
                'name' => $bid->listing->user->name,
            ],
            'payment_summary' => [
                'winning_bid_amount' => $bid->winning_bid_amount,
                'minimum_downpayment' => $bid->minimum_downpayment,
                'total_paid' => $bid->total_paid,
                'remaining_balance' => $bid->remaining_balance,
                'payment_status' => $bid->payment_status,
                'payment_deadline' => $bid->payment_deadline,
                'full_payment_date' => $bid->full_payment_date,
                'is_overdue' => $isOverdue,
                'days_until_deadline' => $daysUntilDeadline,
            ],
            'fulfillment' => [
                'status' => $bid->fulfillment_status,
                'can_fulfill' => $bid->payment_status === 'paid',
            ],
            'payment_history' => $payments->map(function($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'payment_type' => $payment->payment_type,
                    'payment_method' => $payment->payment_method,
                    'payment_reference' => $payment->payment_reference,
                    'payment_date' => $payment->payment_date,
                    'verified_at' => $payment->verified_at,
                    'notes' => $payment->notes,
                ];
            }),
            'pending_payments' => $pendingPayments->map(function($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'payment_type' => $payment->payment_type,
                    'payment_method' => $payment->payment_method,
                    'payment_date' => $payment->payment_date,
                    'status' => $payment->status,
                ];
            }),
        ]);
    }

    /**
     * Delete payment proof file when payment is rejected
     */
    private function deletePaymentProof($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
