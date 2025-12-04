<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'listing_id',
        'quantity',
        'unit',
        'price_per_unit',
        'subtotal',
        'shipping_fee',
        'discount',
        'total_amount',
        'delivery_name',
        'delivery_phone',
        'delivery_street_address',
        'delivery_barangay',
        'delivery_city',
        'delivery_province',
        'delivery_postal_code',
        'payment_method',
        'delivery_method',
        'pickup_notes',
        'shipping_option',
        'estimated_delivery_start',
        'estimated_delivery_end',
        'status',
        'message_for_seller',
        'voucher_code',
        'confirmed_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_per_unit' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'estimated_delivery_start' => 'date',
        'estimated_delivery_end' => 'date',
        'confirmed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Get the buyer that owns the order.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Get the seller that owns the order.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the listing associated with the order.
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
