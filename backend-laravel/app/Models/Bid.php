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
        'winning_bid_amount',
        'total_paid',
        'remaining_balance',
        'minimum_downpayment',
        'payment_status',
        'payment_deadline',
        'full_payment_date',
        'fulfillment_status'
    ];

    protected $casts = [
        'bid_amount' => 'decimal:2',
        'winning_bid_amount' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
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

    /**
     * Relationship: Bid has many payments
     */
    public function payments()
    {
        return $this->hasMany(AuctionPayment::class);
    }

    /**
     * Get verified payments only
     */
    public function verifiedPayments()
    {
        return $this->hasMany(AuctionPayment::class)->verified();
    }

    /**
     * Calculate and update payment status
     */
    public function updatePaymentStatus()
    {
        $this->total_paid = $this->verifiedPayments()->sum('amount');
        $this->remaining_balance = $this->winning_bid_amount - $this->total_paid;

        if ($this->remaining_balance <= 0) {
            $this->payment_status = 'paid';
            $this->full_payment_date = now();
        } elseif ($this->total_paid > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'unpaid';
        }

        // Check if overdue
        if ($this->payment_deadline && now()->gt($this->payment_deadline) && $this->payment_status !== 'paid') {
            $this->payment_status = 'overdue';
        }

        $this->save();
    }
}
