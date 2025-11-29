<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id', 'seller_id', 'buyer_id', 'transaction_type', 'quantity', 'unit_price',
        'total_amount', 'payment_status', 'transaction_status', 'delivery_address', 'delivery_status', 'delivery_date'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'delivery_date' => 'date',
    ];

    public function listing() {
        return $this->belongsTo(Listing::class);
    }

    public function seller() {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
