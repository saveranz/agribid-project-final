<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BidController extends Controller
{
    use ApiResponses;

    // Get user's active bids
    public function index(Request $request)
    {
        try {
            Log::info('BidController index called', [
                'user_id' => $request->user()?->id,
                'user_email' => $request->user()?->email,
            ]);
            
            $bids = Bid::with(['listing.user', 'listing.category'])
                ->where('buyer_id', $request->user()->id)
                ->whereHas('listing', function($q) {
                    $q->active();
                })
                ->latest('bid_time')
                ->get();

            Log::info('Bids found', ['count' => $bids->count()]);

            $bids->transform(function ($bid) {
                $listing = $bid->listing;
                
                // Make sure listing and user exist
                if (!$listing) {
                    return null;
                }
                
                $bid->productName = $listing->name;
                $bid->seller = $listing->user->name ?? 'Unknown';
                $bid->myBid = '₱' . number_format($bid->bid_amount, 2);
                $bid->currentBid = '₱' . number_format($listing->current_bid, 2);
                $bid->status = $bid->is_winning ? 'Winning' : 'Outbid';
                $bid->expiresIn = $listing->auction_end ? $listing->auction_end->diffForHumans() : 'No deadline';
                $bid->image = $listing->image_url 
                    ? ($listing->image_url) 
                    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=75&fit=crop';
                return $bid;
            });
            
            // Filter out any null values
            $bids = $bids->filter();

            Log::info('Bids after transform', ['count' => $bids->count()]);

            return $this->ok('Active bids retrieved successfully', $bids->values());
        } catch (\Exception $e) {
            Log::error('BidController index error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->error('Failed to retrieve bids: ' . $e->getMessage(), 500);
        }
    }

    // Place a new bid
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'bid_amount' => 'required|numeric|min:0',
        ]);

        $listing = Listing::findOrFail($request->listing_id);

        // Validate bid amount
        if ($request->bid_amount <= $listing->current_bid) {
            return $this->error('Bid amount must be higher than current bid', 422);
        }

        if ($listing->auction_end && $listing->auction_end->isPast()) {
            return $this->error('Auction has ended', 422);
        }

        DB::beginTransaction();
        try {
            // Mark all previous bids as not winning
            Bid::where('listing_id', $listing->id)->update(['is_winning' => false]);

            // Create new bid
            $bid = Bid::create([
                'listing_id' => $request->listing_id,
                'buyer_id' => $request->user()->id,
                'bid_amount' => $request->bid_amount,
                'is_winning' => true,
                'bid_time' => now(),
            ]);

            // Update listing current bid
            $listing->update(['current_bid' => $request->bid_amount]);

            // Create notification for the buyer
            \App\Models\Notification::create([
                'user_id' => $request->user()->id,
                'type' => 'bid_placed',
                'message' => "Your bid of ₱" . number_format($request->bid_amount, 2) . " has been placed on {$listing->name}",
                'is_read' => false,
            ]);

            DB::commit();
            
            // Load the bid with relationships for the response
            $bid->load(['listing.user', 'listing.category']);
            
            return $this->success('Bid placed successfully', $bid, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to place bid: ' . $e->getMessage(), 500);
        }
    }

    // Get bidders for a specific listing
    public function getBidders($listingId)
    {
        $listing = Listing::findOrFail($listingId);
        
        // Get all bids for this listing with user info, ordered by amount (highest first)
        $bids = Bid::with('buyer')
            ->where('listing_id', $listingId)
            ->orderBy('bid_amount', 'desc')
            ->orderBy('bid_time', 'asc') // Earlier bid wins if amounts are equal
            ->get();

        // Transform to match frontend structure
        $bidders = $bids->map(function ($bid) {
            $buyer = $bid->buyer;
            return [
                'bidder' => $buyer->name ?? 'Unknown',
                'amount' => '₱' . number_format($bid->bid_amount, 0),
                'time' => $bid->bid_time->diffForHumans(),
                'contact' => $buyer->email ?? 'N/A', // Use email since phone doesn't exist
            ];
        });

        return $this->ok('Bidders retrieved successfully', $bidders);
    }

    public function show(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}

    /**
     * Finalize auction and initialize payment tracking for winning bid
     * This should be called when auction ends
     */
    public function finalizeAuction($listingId)
    {
        $listing = Listing::with('bids')->findOrFail($listingId);

        // Only the seller can finalize their auction
        if ($listing->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            return $this->error('Unauthorized', 'Only the seller can finalize this auction', 403);
        }

        // Check if auction has ended
        if ($listing->auction_end && !$listing->auction_end->isPast()) {
            return $this->error('Auction not ended', 'Auction is still active', 400);
        }

        // Get the winning bid
        $winningBid = $listing->bids()
            ->where('is_winning', true)
            ->orderBy('bid_amount', 'desc')
            ->first();

        if (!$winningBid) {
            return $this->error('No bids', 'This auction has no bids', 400);
        }

        // Check if already finalized
        if ($winningBid->payment_status !== null) {
            return $this->error('Already finalized', 'This auction has already been finalized', 400);
        }

        DB::beginTransaction();
        try {
            // Calculate minimum downpayment (20% of winning bid)
            $minimumDownpayment = $winningBid->bid_amount * 0.20;

            // Initialize payment tracking
            $winningBid->update([
                'winning_bid_amount' => $winningBid->bid_amount,
                'total_paid' => 0,
                'remaining_balance' => $winningBid->bid_amount,
                'minimum_downpayment' => $minimumDownpayment,
                'payment_status' => 'unpaid',
                'payment_deadline' => now()->addDays(3), // 3 days to pay
                'fulfillment_status' => 'pending',
            ]);

            // Update listing status to sold/completed
            $listing->update([
                'status' => 'sold',
            ]);

            // Notify the winning buyer
            $winningBid->buyer->notify(new \App\Notifications\AuctionWon($winningBid));

            DB::commit();

            return $this->success([
                'bid' => $winningBid->fresh(),
                'message' => 'Auction finalized successfully. Buyer has been notified.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Finalization failed', $e->getMessage(), 500);
        }
    }
}
