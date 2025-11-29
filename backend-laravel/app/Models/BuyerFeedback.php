<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerFeedback extends Model
{
    use HasFactory;

    protected $table = 'buyer_feedback';

    protected $fillable = [
        'seller_id',
        'buyer_id',
        'transaction_id',
        'listing_id',
        'rating',
        'comment',
        'transaction_type',
        'payment_speed_rating',
        'communication_rating',
        'reliability_rating',
        'would_transact_again',
        'is_visible',
        'responded_at',
        'buyer_response'
    ];

    protected $casts = [
        'would_transact_again' => 'boolean',
        'is_visible' => 'boolean',
        'responded_at' => 'datetime',
    ];

    /**
     * Relationship: Feedback belongs to a seller (farmer)
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Relationship: Feedback belongs to a buyer
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Relationship: Feedback may relate to a transaction
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Relationship: Feedback may relate to a listing
     */
    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Scope: Get visible feedback only
     */
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    /**
     * Scope: Get feedback by rating
     */
    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Get average rating breakdown
     */
    public function getAverageRatingsAttribute()
    {
        return [
            'overall' => $this->rating,
            'payment_speed' => $this->payment_speed_rating,
            'communication' => $this->communication_rating,
            'reliability' => $this->reliability_rating,
        ];
    }

    /**
     * Check if buyer has responded
     */
    public function hasResponse(): bool
    {
        return !is_null($this->buyer_response);
    }
}
