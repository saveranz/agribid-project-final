<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuctionPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'bid_id',
        'buyer_id',
        'seller_id',
        'listing_id',
        'amount',
        'payment_type',
        'payment_method',
        'payment_reference',
        'payment_proof',
        'status',
        'notes',
        'rejection_reason',
        'payment_date',
        'verified_at',
        'verified_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'verified_at' => 'datetime',
    ];

    /**
     * Relationship: Payment belongs to a bid
     */
    public function bid()
    {
        return $this->belongsTo(Bid::class);
    }

    /**
     * Relationship: Payment belongs to a buyer
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Relationship: Payment belongs to a seller
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Relationship: Payment belongs to a listing
     */
    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Relationship: Payment verified by admin/seller
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Scope: Get verified payments only
     */
    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    /**
     * Scope: Get pending payments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
