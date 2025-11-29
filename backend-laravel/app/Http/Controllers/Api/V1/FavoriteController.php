<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    use ApiResponses;

    /**
     * Display user's favorite listings.
     */
    public function index()
    {
        $favorites = Favorite::with(['listing.user', 'listing.category'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success('Favorites retrieved successfully', $favorites);
    }

    /**
     * Add a listing to favorites.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
        ]);

        // Check if already favorited
        $exists = Favorite::where('user_id', Auth::id())
            ->where('listing_id', $request->listing_id)
            ->exists();

        if ($exists) {
            return $this->error('Listing is already in your favorites', 400);
        }

        $favorite = Favorite::create([
            'user_id' => Auth::id(),
            'listing_id' => $request->listing_id,
        ]);

        // Load the listing relationship
        $favorite->load(['listing.user', 'listing.category']);

        return $this->success('Added to favorites successfully', $favorite);
    }

    /**
     * Remove a listing from favorites.
     */
    public function destroy(string $id)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('listing_id', $id)
            ->first();

        if (!$favorite) {
            return $this->error('Favorite not found', 404);
        }

        $favorite->delete();

        return $this->success('Removed from favorites successfully', null);
    }

    /**
     * Check if a listing is favorited.
     */
    public function check(string $listingId)
    {
        $isFavorited = Favorite::where('user_id', Auth::id())
            ->where('listing_id', $listingId)
            ->exists();

        return $this->success(['is_favorited' => $isFavorited]);
    }

    /**
     * Get time remaining until auction end.
     */
    private function getTimeRemaining($auctionEnd)
    {
        $now = now();
        $end = \Carbon\Carbon::parse($auctionEnd);
        
        if ($end->isPast()) {
            return 'Ended';
        }

        $diff = $now->diff($end);
        
        if ($diff->d > 0) {
            return $diff->d . ' day' . ($diff->d > 1 ? 's' : '');
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '');
        } else {
            return $diff->i . ' min' . ($diff->i > 1 ? 's' : '');
        }
    }
}
