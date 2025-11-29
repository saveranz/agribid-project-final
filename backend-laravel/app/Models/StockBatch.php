<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'quantity',
        'remaining_quantity',
        'price',
        'batch_date',
        'batch_number',
        'notes',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'batch_date' => 'date',
    ];

    /**
     * Relationship: Stock batch belongs to a listing
     */
    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Check if batch has available stock
     */
    public function hasStock(): bool
    {
        return $this->remaining_quantity > 0 && $this->status === 'active';
    }

    /**
     * Deduct quantity from this batch
     */
    public function deduct(int $quantity): bool
    {
        if ($this->remaining_quantity < $quantity) {
            return false;
        }

        $this->remaining_quantity -= $quantity;
        
        if ($this->remaining_quantity === 0) {
            $this->status = 'sold_out';
        }

        return $this->save();
    }

    /**
     * Scope: Get active batches only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('remaining_quantity', '>', 0);
    }

    /**
     * Scope: Order by oldest batch first (FIFO)
     */
    public function scopeOldestFirst($query)
    {
        return $query->orderBy('batch_date', 'asc')->orderBy('created_at', 'asc');
    }
}
