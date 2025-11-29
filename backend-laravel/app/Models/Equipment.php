<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipment';

    protected $fillable = [
        'owner_id', 'name', 'description', 'type', 'rate_per_day', 'location',
        'availability_status', 'next_available_date', 'total_bookings', 'rating', 'reviews_count', 'is_active'
    ];

    protected $casts = [
        'rate_per_day' => 'decimal:2',
        'next_available_date' => 'date',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function scopeAvailable($query) {
        return $query->where('availability_status', 'available')->where('is_active', true);
    }
}
