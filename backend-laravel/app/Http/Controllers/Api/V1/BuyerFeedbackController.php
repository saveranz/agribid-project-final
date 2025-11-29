<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BuyerFeedback;
use App\Models\User;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuyerFeedbackController extends Controller
{
    use ApiResponses;

    /**
     * Get feedback for a specific buyer
     */
    public function index(Request $request, $buyerId = null)
    {
        $buyerId = $buyerId ?? $request->get('buyer_id');
        
        $query = BuyerFeedback::with(['seller', 'buyer', 'listing'])
            ->visible()
            ->latest();

        if ($buyerId) {
            $query->where('buyer_id', $buyerId);
        }

        $feedback = $query->paginate(20);

        return $this->ok('Feedback retrieved successfully', $feedback);
    }

    /**
     * Get feedback given by the authenticated seller
     */
    public function myGivenFeedback()
    {
        $feedback = BuyerFeedback::with(['buyer', 'listing'])
            ->where('seller_id', Auth::id())
            ->latest()
            ->paginate(20);

        return $this->ok('Your feedback retrieved successfully', $feedback);
    }

    /**
     * Get feedback received by the authenticated buyer
     */
    public function myReceivedFeedback()
    {
        $feedback = BuyerFeedback::with(['seller', 'listing'])
            ->where('buyer_id', Auth::id())
            ->visible()
            ->latest()
            ->paginate(20);

        return $this->ok('Feedback received successfully', $feedback);
    }

    /**
     * Get buyer rating summary
     */
    public function getBuyerRating($buyerId)
    {
        $buyer = User::findOrFail($buyerId);
        
        $feedback = BuyerFeedback::where('buyer_id', $buyerId)
            ->visible()
            ->get();

        if ($feedback->isEmpty()) {
            return $this->ok('No feedback yet', [
                'buyer_id' => $buyerId,
                'buyer_name' => $buyer->name,
                'overall_rating' => 0,
                'total_reviews' => 0,
                'ratings_breakdown' => [
                    'overall' => 0,
                    'payment_speed' => 0,
                    'communication' => 0,
                    'reliability' => 0,
                ],
                'would_transact_again_percentage' => 0,
                'rating_distribution' => [
                    5 => 0,
                    4 => 0,
                    3 => 0,
                    2 => 0,
                    1 => 0,
                ],
            ]);
        }

        $totalReviews = $feedback->count();
        $ratingDistribution = [
            5 => $feedback->where('rating', 5)->count(),
            4 => $feedback->where('rating', 4)->count(),
            3 => $feedback->where('rating', 3)->count(),
            2 => $feedback->where('rating', 2)->count(),
            1 => $feedback->where('rating', 1)->count(),
        ];

        return $this->ok('Buyer rating retrieved successfully', [
            'buyer_id' => $buyerId,
            'buyer_name' => $buyer->name,
            'overall_rating' => round($feedback->avg('rating'), 2),
            'total_reviews' => $totalReviews,
            'ratings_breakdown' => [
                'overall' => round($feedback->avg('rating'), 2),
                'payment_speed' => round($feedback->avg('payment_speed_rating'), 2),
                'communication' => round($feedback->avg('communication_rating'), 2),
                'reliability' => round($feedback->avg('reliability_rating'), 2),
            ],
            'would_transact_again_percentage' => round(
                ($feedback->where('would_transact_again', true)->count() / $totalReviews) * 100,
                1
            ),
            'rating_distribution' => $ratingDistribution,
            'recent_feedback' => $feedback->take(5)->map(function ($item) {
                return [
                    'id' => $item->id,
                    'rating' => $item->rating,
                    'comment' => $item->comment,
                    'seller_name' => $item->seller->name ?? 'Unknown',
                    'listing_name' => $item->listing->name ?? 'N/A',
                    'created_at' => $item->created_at->format('Y-m-d'),
                ];
            }),
        ]);
    }

    /**
     * Submit feedback for a buyer
     */
    public function store(Request $request)
    {
        $request->validate([
            'buyer_id' => 'required|exists:users,id',
            'listing_id' => 'nullable|exists:listings,id',
            'transaction_id' => 'nullable|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'transaction_type' => 'nullable|in:purchase,bid,rental',
            'payment_speed_rating' => 'nullable|integer|min:1|max:5',
            'communication_rating' => 'nullable|integer|min:1|max:5',
            'reliability_rating' => 'nullable|integer|min:1|max:5',
            'would_transact_again' => 'nullable|boolean',
        ]);

        // Verify the listing belongs to the authenticated seller
        if ($request->listing_id) {
            $listing = Listing::where('id', $request->listing_id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$listing) {
                return $this->error('You can only leave feedback for your own listings', 403);
            }
        }

        // Check if feedback already exists
        $existingFeedback = BuyerFeedback::where('seller_id', Auth::id())
            ->where('buyer_id', $request->buyer_id)
            ->where('listing_id', $request->listing_id)
            ->first();

        if ($existingFeedback) {
            return $this->error('You have already submitted feedback for this buyer on this listing', 409);
        }

        $feedback = BuyerFeedback::create([
            'seller_id' => Auth::id(),
            'buyer_id' => $request->buyer_id,
            'transaction_id' => $request->transaction_id,
            'listing_id' => $request->listing_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'transaction_type' => $request->transaction_type ?? 'purchase',
            'payment_speed_rating' => $request->payment_speed_rating,
            'communication_rating' => $request->communication_rating,
            'reliability_rating' => $request->reliability_rating,
            'would_transact_again' => $request->would_transact_again ?? true,
        ]);

        $feedback->load(['buyer', 'listing']);

        return $this->success($feedback, 'Feedback submitted successfully', 201);
    }

    /**
     * Update feedback
     */
    public function update(Request $request, $id)
    {
        $feedback = BuyerFeedback::where('seller_id', Auth::id())->findOrFail($id);

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'payment_speed_rating' => 'nullable|integer|min:1|max:5',
            'communication_rating' => 'nullable|integer|min:1|max:5',
            'reliability_rating' => 'nullable|integer|min:1|max:5',
            'would_transact_again' => 'nullable|boolean',
            'is_visible' => 'nullable|boolean',
        ]);

        $feedback->update($request->only([
            'rating',
            'comment',
            'payment_speed_rating',
            'communication_rating',
            'reliability_rating',
            'would_transact_again',
            'is_visible',
        ]));

        return $this->success($feedback->fresh(['buyer', 'listing']), 'Feedback updated successfully');
    }

    /**
     * Buyer responds to feedback
     */
    public function respond(Request $request, $id)
    {
        $feedback = BuyerFeedback::where('buyer_id', Auth::id())->findOrFail($id);

        $request->validate([
            'response' => 'required|string|max:500',
        ]);

        $feedback->update([
            'buyer_response' => $request->response,
            'responded_at' => now(),
        ]);

        return $this->success($feedback->fresh(['seller', 'buyer']), 'Response submitted successfully');
    }

    /**
     * Delete feedback
     */
    public function destroy($id)
    {
        $feedback = BuyerFeedback::where('seller_id', Auth::id())->findOrFail($id);
        $feedback->delete();

        return $this->success(null, 'Feedback deleted successfully');
    }

    /**
     * Get buyers who purchased from seller (for feedback purposes)
     */
    public function getEligibleBuyers()
    {
        $sellerId = Auth::id();
        
        // Get all listings from this seller
        $listings = Listing::where('user_id', $sellerId)->pluck('id');

        // Get unique buyers who bid on these listings
        $buyers = DB::table('bids')
            ->join('users', 'bids.buyer_id', '=', 'users.id')
            ->join('listings', 'bids.listing_id', '=', 'listings.id')
            ->whereIn('bids.listing_id', $listings)
            ->select('users.id', 'users.name', 'users.email', 'listings.id as listing_id', 'listings.name as listing_name')
            ->distinct()
            ->get()
            ->groupBy('id')
            ->map(function ($bids, $userId) use ($sellerId) {
                $user = $bids->first();
                $userListings = $bids->pluck('listing_name', 'listing_id')->toArray();
                
                // Check if feedback already given
                $feedbackGiven = BuyerFeedback::where('seller_id', $sellerId)
                    ->where('buyer_id', $userId)
                    ->pluck('listing_id')
                    ->toArray();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'listings' => $userListings,
                    'feedback_given' => $feedbackGiven,
                    'can_give_feedback' => count($feedbackGiven) < count($userListings),
                ];
            })
            ->values();

        return $this->ok('Eligible buyers retrieved successfully', $buyers);
    }
}
