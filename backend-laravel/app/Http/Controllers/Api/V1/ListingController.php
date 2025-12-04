<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Traits\ApiResponses;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    use ApiResponses;

    public function index(Request $request)
    {
        // Cache key based on request parameters
        $cacheKey = 'listings_' . md5(json_encode($request->all()) . (Auth::id() ?? 'guest'));
        
        // Return cached response if available (cache for 1 minute)
        $cachedResponse = cache()->remember($cacheKey, 60, function () use ($request) {
            return $this->fetchListings($request);
        });
        
        return $this->ok($cachedResponse['message'], $cachedResponse['listings']);
    }
    
    protected function fetchListings(Request $request)
    {
        // Optimized query with eager loading and selective fields
        $query = Listing::select([
            'id', 'user_id', 'category_id', 'name', 'type', 'listing_type', 
            'quantity', 'unit', 'starting_bid', 'current_bid', 'buy_now_price',
            'location', 'description', 'image_url', 'auction_start', 'auction_end',
            'status', 'approval_status', 'sold_count', 'rating', 'created_at', 'updated_at'
        ])
        ->with([
            'user:id,name',
            'category:id,name,slug',
            'bids:id,listing_id,buyer_id',
            'stockBatches' => function ($query) {
                $query->select('id', 'listing_id', 'remaining_quantity', 'price', 'batch_date', 'status')
                      ->where('status', 'active')
                      ->orderBy('batch_date');
            }
        ]);

        // If requesting farmer's own listings
        if ($request->has('my_listings') && $request->my_listings) {
            $query->where('user_id', Auth::id());
        } else {
            $query->active();
        }

        // Filter by listing type
        if ($request->has('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Use index for sorting
        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 200); // Max 200 items per page
        $listings = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $listings->getCollection()->transform(function ($listing) {
            // Defensive: handle missing relationships
            $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
            $listing->farmer_name = ($listing->user && isset($listing->user->name)) ? $listing->user->name : 'Unknown';
            $listing->category_name = ($listing->category && isset($listing->category->name)) ? $listing->category->name : 'Uncategorized';
            $listing->sold = $listing->sold_count ?? 0;
            $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
            
            // Ensure image_url is full URL
            if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
                $listing->image_url = url($listing->image_url);
            }
            
            // Add batch pricing info
            $listing->total_available = $listing->total_available_quantity;
            $listing->price_range = [
                'lowest' => $listing->lowest_price,
                'highest' => $listing->highest_price,
            ];
            $listing->batch_count = $listing->stockBatches->count();
            $listing->batch_pricing = $listing->batch_pricing;
            
            return $listing;
        });

        return [
            'listings' => $listings,
            'message' => 'Listings retrieved successfully'
        ];
    }

    public function show($id)
    {
        $listing = Listing::with(['user', 'category', 'bids', 'stockBatches'])->findOrFail($id);
        $listing->update(['views_count' => $listing->views_count + 1]);
        $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
        $listing->sold = $listing->sold_count ?? 0;
        $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
        
        // Ensure image_url is full URL
        if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
            $listing->image_url = url($listing->image_url);
        }
        
        // Add batch pricing details
        $listing->total_available = $listing->total_available_quantity;
        $listing->price_range = [
            'lowest' => $listing->lowest_price,
            'highest' => $listing->highest_price,
        ];
        $listing->batch_pricing = $listing->batch_pricing;

        return $this->ok('Listing details retrieved successfully', $listing);
    }

    public function flashDeals()
    {
        $listings = Listing::with(['user', 'category', 'bids'])
            ->active()
            ->whereNotNull('buy_now_price')
            ->orderBy('current_bid', 'desc')
            ->limit(8)
            ->get();

        $listings->transform(function ($listing) {
            $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
            $listing->discount = rand(10, 30) . '%';
            $listing->sold = $listing->sold_count ?? 0;
            $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
            
            // Ensure image_url is full URL
            if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
                $listing->image_url = url($listing->image_url);
            }
            
            return $listing;
        });

        return $this->ok('Flash deals retrieved successfully', $listings);
    }

    public function auctionListings(Request $request)
    {
        $query = Listing::with(['user', 'category', 'bids'])
            ->active()
            ->auction();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 200); // Max 200 items per page
        $listings = $query->latest()->paginate($perPage);

        $listings->getCollection()->transform(function ($listing) {
            $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
            $listing->farmer_name = ($listing->user && isset($listing->user->name)) ? $listing->user->name : 'Unknown';
            $listing->category_name = ($listing->category && isset($listing->category->name)) ? $listing->category->name : 'Uncategorized';
            $listing->sold = $listing->sold_count ?? 0;
            $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
            
            // Ensure image_url is full URL
            if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
                $listing->image_url = url($listing->image_url);
            }
            
            return $listing;
        });

        return $this->ok('Auction listings retrieved successfully', $listings);
    }

    public function directBuyListings(Request $request)
    {
        $query = Listing::with(['user', 'category', 'bids'])
            ->active()
            ->directBuy();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->input('per_page', 20);
        $perPage = min($perPage, 200); // Max 200 items per page
        $listings = $query->latest()->paginate($perPage);

        $listings->getCollection()->transform(function ($listing) {
            $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
            $listing->farmer_name = ($listing->user && isset($listing->user->name)) ? $listing->user->name : 'Unknown';
            $listing->category_name = ($listing->category && isset($listing->category->name)) ? $listing->category->name : 'Uncategorized';
            $listing->sold = $listing->sold_count ?? 0;
            $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
            
            // Ensure image_url is full URL
            if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
                $listing->image_url = url($listing->image_url);
            }
            
            return $listing;
        });

        return $this->ok('Direct buy listings retrieved successfully', $listings);
    }

    public function store(Request $request)
    {
        // Base validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'type' => 'required|string|max:100',
            'listing_type' => 'required|in:auction,direct_buy',
            'quantity' => 'required|string|max:50',
            'unit' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|max:5120', // 5MB max
        ];

        // Add conditional validation based on listing_type
        if ($request->listing_type === 'auction') {
            $rules['starting_bid'] = 'required|numeric|min:0';
            $rules['buy_now_price'] = 'nullable|numeric|gt:starting_bid';
            $rules['auction_start'] = 'required|date';
            $rules['auction_end'] = 'required|date|after:auction_start';
        } else {
            // direct_buy
            $rules['buy_now_price'] = 'required|numeric|min:0';
        }

        $request->validate($rules);

        $data = $request->except('image');
        $data['user_id'] = Auth::id();
        $data['status'] = 'active';
        $data['approval_status'] = 'approved';

        // Convert boolean fields from string to actual boolean
        $booleanFields = ['organic_certified', 'fair_trade_certified', 'gap_certified', 'pesticide_free'];
        foreach ($booleanFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        // Set appropriate fields based on listing type
        if ($data['listing_type'] === 'direct_buy') {
            // Direct buy - no bid fields, no auction dates
            $data['starting_bid'] = null;
            $data['current_bid'] = null;
            $data['auction_start'] = null;
            $data['auction_end'] = null;
        } else {
            // Auction - initialize current_bid to 0
            $data['current_bid'] = 0;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('listings', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }

        $listing = Listing::create($data);

        // Create stock batches from bulk pricing tiers (if provided)
        $this->createStockBatchesFromBulkPricing($listing, $request);

        return $this->success([
            'listing' => $listing->fresh(['stockBatches']),
            'message' => 'Listing created successfully and is now live!',
        ], 'Listing created successfully', 201);
    }

    /**
     * Create stock batches from bulk pricing tier data
     */
    private function createStockBatchesFromBulkPricing($listing, $request)
    {
        $quantity = (float) $listing->quantity;
        $batches = [];

        // Tier 1: 1-10 kg
        if ($request->has('price_per_kg_1_10') && $request->price_per_kg_1_10) {
            $tier1Qty = min(10, $quantity);
            if ($tier1Qty > 0) {
                $batches[] = [
                    'listing_id' => $listing->id,
                    'quantity' => $tier1Qty,
                    'remaining_quantity' => $tier1Qty,
                    'price' => $request->price_per_kg_1_10,
                    'batch_date' => now()->toDateString(),
                    'batch_number' => 'TIER-1-10',
                    'notes' => 'Bulk pricing tier: 1-10 ' . $listing->unit,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Tier 2: 11-50 kg
        if ($request->has('price_per_kg_11_50') && $request->price_per_kg_11_50 && $quantity > 10) {
            $tier2Qty = min(40, $quantity - 10);
            if ($tier2Qty > 0) {
                $batches[] = [
                    'listing_id' => $listing->id,
                    'quantity' => $tier2Qty,
                    'remaining_quantity' => $tier2Qty,
                    'price' => $request->price_per_kg_11_50,
                    'batch_date' => now()->toDateString(),
                    'batch_number' => 'TIER-11-50',
                    'notes' => 'Bulk pricing tier: 11-50 ' . $listing->unit,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Tier 3: 51-100 kg
        if ($request->has('price_per_kg_51_100') && $request->price_per_kg_51_100 && $quantity > 50) {
            $tier3Qty = min(50, $quantity - 50);
            if ($tier3Qty > 0) {
                $batches[] = [
                    'listing_id' => $listing->id,
                    'quantity' => $tier3Qty,
                    'remaining_quantity' => $tier3Qty,
                    'price' => $request->price_per_kg_51_100,
                    'batch_date' => now()->toDateString(),
                    'batch_number' => 'TIER-51-100',
                    'notes' => 'Bulk pricing tier: 51-100 ' . $listing->unit,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Tier 4: 100+ kg
        if ($request->has('price_per_kg_100_plus') && $request->price_per_kg_100_plus && $quantity > 100) {
            $tier4Qty = $quantity - 100;
            if ($tier4Qty > 0) {
                $batches[] = [
                    'listing_id' => $listing->id,
                    'quantity' => $tier4Qty,
                    'remaining_quantity' => $tier4Qty,
                    'price' => $request->price_per_kg_100_plus,
                    'batch_date' => now()->toDateString(),
                    'batch_number' => 'TIER-100-PLUS',
                    'notes' => 'Bulk pricing tier: 100+ ' . $listing->unit,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert all batches at once
        if (!empty($batches)) {
            DB::table('stock_batches')->insert($batches);
        }
    }

    public function update(Request $request, string $id)
    {
        $listing = Listing::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'nullable|string',
            'quantity' => 'sometimes|required|string|max:50',
            'unit' => 'sometimes|required|string|max:20',
            'starting_bid' => 'sometimes|required|numeric|min:0',
            'buy_now_price' => 'nullable|numeric',
            'location' => 'sometimes|required|string|max:255',
            'auction_end' => 'sometimes|required|date|after:now',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = $request->except('image');

        // Convert boolean fields from string to actual boolean
        $booleanFields = ['organic_certified', 'fair_trade_certified', 'gap_certified', 'pesticide_free'];
        foreach ($booleanFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($listing->image_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $listing->image_url));
            }
            $imagePath = $request->file('image')->store('listings', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }

        $listing->update($data);

        return $this->success($listing, 'Listing updated successfully');
    }

    public function destroy(string $id)
    {
        $listing = Listing::where('user_id', Auth::id())->findOrFail($id);

        // Soft delete (archive) the listing
        $listing->delete();

        return $this->success(null, 'Listing archived successfully');
    }

    /**
     * Get archived (soft deleted) listings for the authenticated user
     */
    public function archived()
    {
        $listings = Listing::with(['user', 'category', 'bids', 'stockBatches'])
            ->where('user_id', Auth::id())
            ->onlyTrashed()
            ->latest('deleted_at')
            ->get();

        $listings->transform(function ($listing) {
            $listing->bidders_count = $listing->bids->unique('buyer_id')->count();
            $listing->farmer_name = ($listing->user && isset($listing->user->name)) ? $listing->user->name : 'Unknown';
            $listing->category_name = ($listing->category && isset($listing->category->name)) ? $listing->category->name : 'Uncategorized';
            $listing->sold = $listing->sold_count ?? 0;
            $listing->rating = $listing->rating ? (float)$listing->rating : 0.0;
            
            // Ensure image_url is full URL
            if ($listing->image_url && !str_starts_with($listing->image_url, 'http')) {
                $listing->image_url = url($listing->image_url);
            }
            
            // Add batch pricing info
            $listing->total_available = $listing->total_available_quantity;
            $listing->price_range = [
                'lowest' => $listing->lowest_price,
                'highest' => $listing->highest_price,
            ];
            $listing->batch_count = $listing->stockBatches->count();
            $listing->batch_pricing = $listing->batch_pricing;
            
            return $listing;
        });

        return $this->ok('Archived listings retrieved successfully', $listings);
    }

    /**
     * Restore an archived listing
     */
    public function restore(string $id)
    {
        $listing = Listing::where('user_id', Auth::id())
            ->onlyTrashed()
            ->findOrFail($id);

        $listing->restore();

        return $this->success($listing, 'Listing restored successfully');
    }
}

