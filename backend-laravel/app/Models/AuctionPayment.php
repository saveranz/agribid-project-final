<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuctionPayment extends Model
{
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
        'notes',
        'rejection_reason',
        'status',
        'payment_date',
        'verified_at',
        'verified_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function bid() {
        return $this->belongsTo(Bid::class);
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller() {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
