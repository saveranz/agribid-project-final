<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'name', 'description', 'type', 'listing_type', 'quantity', 'unit',
        'starting_bid', 'buy_now_price', 'current_bid', 'location', 'latitude', 'longitude',
        'status', 'auction_start', 'auction_end', 'approval_status', 'views_count', 'image_url',
        'sold_count', 'rating',
        // Enhanced product details
        'harvest_date', 'expiry_date', 'quality_grade', 'organic_certified', 'fair_trade_certified',
        'gap_certified', 'farm_name', 'farm_description', 'variety', 'growing_method', 
        'pesticide_free', 'nutrition_info', 'storage_requirements', 'shipping_info'
    ];

    protected $casts = [
        'starting_bid' => 'decimal:2',
        'buy_now_price' => 'decimal:2',
        'current_bid' => 'decimal:2',
        'auction_start' => 'datetime',
        'auction_end' => 'datetime',
        'harvest_date' => 'date',
        'expiry_date' => 'date',
        'organic_certified' => 'boolean',
        'fair_trade_certified' => 'boolean',
        'gap_certified' => 'boolean',
        'pesticide_free' => 'boolean',
    ];

    public function farmer() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function bids() {
        return $this->hasMany(Bid::class);
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relationship: Listing has many stock batches
     */
    public function stockBatches()
    {
        return $this->hasMany(StockBatch::class);
    }

    /**
     * Get active stock batches
     */
    public function activeStockBatches()
    {
        return $this->hasMany(StockBatch::class)->active();
    }

    /**
     * Get total available quantity across all batches
     */
    public function getTotalAvailableQuantityAttribute(): int
    {
        return $this->stockBatches()->active()->sum('remaining_quantity');
    }

    /**
     * Get lowest price from active batches
     */
    public function getLowestPriceAttribute()
    {
        return $this->stockBatches()->active()->min('price');
    }

    /**
     * Get highest price from active batches
     */
    public function getHighestPriceAttribute()
    {
        return $this->stockBatches()->active()->max('price');
    }

    /**
     * Get all batches with their prices (for buyer view)
     */
    public function getBatchPricingAttribute()
    {
        return $this->stockBatches()
            ->active()
            ->oldestFirst()
            ->select('id', 'remaining_quantity', 'price', 'batch_date', 'batch_number', 'notes')
            ->get();
    }

    /**
     * Deduct quantity using FIFO method
     */
    public function deductStock(int $quantity): bool
    {
        $remainingToDeduct = $quantity;
        $batches = $this->stockBatches()->active()->oldestFirst()->get();

        foreach ($batches as $batch) {
            if ($remainingToDeduct <= 0) {
                break;
            }

            $deductFromBatch = min($batch->remaining_quantity, $remainingToDeduct);
            
            if (!$batch->deduct($deductFromBatch)) {
                return false;
            }

            $remainingToDeduct -= $deductFromBatch;
        }

        // Update main listing quantity
        $this->quantity = $this->total_available_quantity;
        $this->save();

        return $remainingToDeduct === 0;
    }

    public function scopeActive($query) {
        return $query->where('status', 'active')->where('approval_status', 'approved');
    }

    public function scopeAuction($query) {
        return $query->where('listing_type', 'auction');
    }

    public function scopeDirectBuy($query) {
        return $query->where('listing_type', 'direct_buy');
    }
}
