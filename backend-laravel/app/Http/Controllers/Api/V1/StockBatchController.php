<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\StockBatch;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockBatchController extends Controller
{
    use ApiResponses;

    /**
     * Add new stock batch to a listing
     */
    public function store(Request $request, $listingId)
    {
        $listing = Listing::where('user_id', Auth::id())->findOrFail($listingId);

        $request->validate([
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'batch_date' => 'nullable|date',
            'batch_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Create new stock batch
        $batch = StockBatch::create([
            'listing_id' => $listing->id,
            'quantity' => $request->quantity,
            'remaining_quantity' => $request->quantity,
            'price' => $request->price,
            'batch_date' => $request->batch_date ?? now()->toDateString(),
            'batch_number' => $request->batch_number,
            'notes' => $request->notes,
            'status' => 'active',
        ]);

        // Update listing total quantity
        $listing->quantity = $listing->total_available_quantity;
        
        // Update buy_now_price to lowest available price
        $listing->buy_now_price = $listing->lowest_price;
        $listing->save();

        return $this->success([
            'batch' => $batch,
            'listing' => $listing->fresh(['stockBatches']),
        ], 'Stock batch added successfully', 201);
    }

    /**
     * Get all stock batches for a listing
     */
    public function index($listingId)
    {
        $listing = Listing::findOrFail($listingId);
        
        $batches = $listing->stockBatches()
            ->orderBy('batch_date', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return $this->ok('Stock batches retrieved successfully', [
            'listing_id' => $listing->id,
            'listing_name' => $listing->name,
            'total_quantity' => $listing->total_available_quantity,
            'price_range' => [
                'lowest' => $listing->lowest_price,
                'highest' => $listing->highest_price,
            ],
            'batches' => $batches,
        ]);
    }

    /**
     * Update a stock batch
     */
    public function update(Request $request, $listingId, $batchId)
    {
        $listing = Listing::where('user_id', Auth::id())->findOrFail($listingId);
        $batch = StockBatch::where('listing_id', $listing->id)->findOrFail($batchId);

        $request->validate([
            'quantity' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'batch_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:active,sold_out,expired',
        ]);

        // If quantity is being updated, update remaining_quantity proportionally
        if ($request->has('quantity')) {
            $soldQuantity = $batch->quantity - $batch->remaining_quantity;
            $batch->quantity = $request->quantity;
            $batch->remaining_quantity = max(0, $request->quantity - $soldQuantity);
        }

        // Update other fields
        if ($request->has('price')) {
            $batch->price = $request->price;
        }
        if ($request->has('batch_number')) {
            $batch->batch_number = $request->batch_number;
        }
        if ($request->has('notes')) {
            $batch->notes = $request->notes;
        }
        if ($request->has('status')) {
            $batch->status = $request->status;
        }

        $batch->save();

        // Update listing totals
        $listing->quantity = $listing->total_available_quantity;
        $listing->buy_now_price = $listing->lowest_price;
        $listing->save();

        return $this->success($batch->fresh(), 'Stock batch updated successfully');
    }

    /**
     * Delete a stock batch
     */
    public function destroy($listingId, $batchId)
    {
        $listing = Listing::where('user_id', Auth::id())->findOrFail($listingId);
        $batch = StockBatch::where('listing_id', $listing->id)->findOrFail($batchId);

        $batch->delete();

        // Update listing totals
        $listing->quantity = $listing->total_available_quantity;
        $listing->buy_now_price = $listing->lowest_price;
        $listing->save();

        return $this->success(null, 'Stock batch deleted successfully');
    }
}
