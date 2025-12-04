<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== SIMULATING /api/v1/direct-buy ENDPOINT ===\n\n";

$query = \App\Models\Listing::with(['user', 'category', 'bids'])
    ->where('listing_type', 'direct_buy')
    ->where('status', 'active')
    ->where('approval_status', 'approved');

$listings = $query->take(10)->get();

echo "Total Direct Buy Listings: " . $query->count() . "\n\n";
echo "Sample listings with categories:\n";

foreach ($listings as $listing) {
    echo "- {$listing->name}\n";
    echo "  Category ID: {$listing->category_id}\n";
    
    if ($listing->category) {
        echo "  Category Object: {$listing->category->name} ({$listing->category->slug})\n";
    } else {
        echo "  Category Object: NULL\n";
    }
    echo "\n";
}
