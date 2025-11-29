<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'street_address',
        'barangay',
        'city',
        'province',
        'postal_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship: Feedback given by this user as a seller
     */
    public function feedbackGiven()
    {
        return $this->hasMany(BuyerFeedback::class, 'seller_id');
    }

    /**
     * Relationship: Feedback received by this user as a buyer
     */
    public function feedbackReceived()
    {
        return $this->hasMany(BuyerFeedback::class, 'buyer_id');
    }

    /**
     * Get buyer's average rating
     */
    public function getAverageBuyerRatingAttribute()
    {
        return $this->feedbackReceived()
            ->visible()
            ->avg('rating') ?? 0;
    }

    /**
     * Get buyer's total feedback count
     */
    public function getBuyerFeedbackCountAttribute()
    {
        return $this->feedbackReceived()
            ->visible()
            ->count();
    }

    /**
     * Get detailed buyer ratings breakdown
     */
    public function getBuyerRatingsBreakdownAttribute()
    {
        $feedback = $this->feedbackReceived()->visible();
        
        return [
            'overall' => round($feedback->avg('rating') ?? 0, 2),
            'payment_speed' => round($feedback->avg('payment_speed_rating') ?? 0, 2),
            'communication' => round($feedback->avg('communication_rating') ?? 0, 2),
            'reliability' => round($feedback->avg('reliability_rating') ?? 0, 2),
            'total_reviews' => $feedback->count(),
            'would_transact_again_percentage' => $feedback->count() > 0
                ? round(($feedback->where('would_transact_again', true)->count() / $feedback->count()) * 100, 1)
                : 0,
        ];
    }
}
