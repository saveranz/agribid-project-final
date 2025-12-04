<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\Equipment;

// Simulate what the controller does
$equipment = Equipment::with(['owner'])->where('is_active', true)->get();

$transformed = $equipment->map(function ($item) {
    $specs = $item->specifications;
    
    return [
        'id' => $item->id,
        'name' => $item->name,
        'owner' => $item->owner->name ?? 'Unknown',
        'owner_id' => $item->owner_id,
        'type' => $item->type,
        'rate' => '₱' . number_format($item->rate_per_day, 2),
        'rate_per_day' => $item->rate_per_day,
        'available' => $item->availability_status === 'available',
        'availability_status' => $item->availability_status,
        'location' => $item->location,
        'image' => $item->image_url ? url($item->image_url) : 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
        'rating' => $specs['rating'] ?? 4.5,
        'reviews' => $specs['reviews'] ?? 0,
        'nextAvailable' => $specs['next_available'] ?? null,
    ];
});

$response = [
    'success' => true,
    'data' => [
        'current_page' => 1,
        'data' => $transformed->toArray(),
        'total' => $transformed->count()
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
