<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = ['listing_id', 'buyer_id', 'bid_amount', 'is_winning', 'bid_time'];

    protected $casts = [
        'bid_amount' => 'decimal:2',
        'is_winning' => 'boolean',
        'bid_time' => 'datetime',
    ];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
