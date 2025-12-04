<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BidController extends Controller
{
    use ApiResponses;

    // Get user's active bids
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $cacheKey = "bids_user_{$userId}";
            
            // Cache for 30 seconds
            $bids = cache()->remember($cacheKey, 30, function () use ($request, $userId) {
                return Bid::select('bids.*')
                    ->with(['listing:id,name,user_id,current_bid,auction_end,image_url,listing_type,status,approval_status', 'listing.user:id,name', 'payments'])
                    ->where('buyer_id', $userId)
                    ->where(function($query) use ($userId) {
                        // Include active listings
                        $query->whereHas('listing', function($q) {
                            $q->where('status', 'active')->where('approval_status', 'approved');
                        })
                        // OR include winning bids even if auction ended
                        ->orWhere(function($q) use ($userId) {
                            $q->where('buyer_id', $userId)
                              ->where('is_winning', true);
                        });
                    })
                    ->latest('bid_time')
                    ->get();
            });

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

            return $this->ok('Active bids retrieved successfully', $bids->values());
        } catch (\Exception $e) {
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

            DB::commit();
            
            // Clear user's bid cache
            cache()->forget("bids_user_{$request->user()->id}");
            
            return $this->success('Bid placed successfully', [
                'id' => $bid->id,
                'bid_amount' => $bid->bid_amount,
                'listing_id' => $listing->id,
                'is_winning' => true
            ], 201);
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

    // Get winning bids for seller's listings
    public function getSellerWinningBids(Request $request)
    {
        try {
            $sellerId = $request->user()->id;
            
            $winningBids = Bid::with(['listing:id,name,user_id', 'buyer:id,name,email,phone', 'payments'])
                ->where('is_winning', true)
                ->whereHas('listing', function($q) use ($sellerId) {
                    $q->where('user_id', $sellerId);
                })
                ->latest('bid_time')
                ->get();

            return $this->ok('Winning bids retrieved successfully', $winningBids);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve winning bids: ' . $e->getMessage(), 500);
        }
    }

    public function show(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}
