<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id', 
        'buyer_id', 
        'bid_amount', 
        'is_winning', 
        'bid_time',
        'downpayment_amount',
        'remaining_balance',
        'total_paid',
        'payment_status',
        'payment_deadline',
        'full_payment_date',
        'fulfillment_status',
        'winning_bid_amount',
        'minimum_downpayment'
    ];

    protected $casts = [
        'bid_amount' => 'decimal:2',
        'downpayment_amount' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'winning_bid_amount' => 'decimal:2',
        'minimum_downpayment' => 'decimal:2',
        'is_winning' => 'boolean',
        'bid_time' => 'datetime',
        'payment_deadline' => 'datetime',
        'full_payment_date' => 'datetime',
    ];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function payments() {
        return $this->hasMany(AuctionPayment::class);
    }
}
