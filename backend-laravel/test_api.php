<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING API RESPONSE ===\n\n";

// Simulate what the API returns
$listings = \App\Models\Listing::with(['user', 'category', 'bids'])
    ->where('listing_type', 'direct_buy')
    ->where('status', 'active')
    ->where('approval_status', 'approved')
    ->take(3)
    ->get();

foreach ($listings as $listing) {
    echo "Name: {$listing->name}\n";
    echo "Category Object: " . ($listing->category ? "EXISTS" : "NULL") . "\n";
    if ($listing->category) {
        echo "  - Category ID: {$listing->category->id}\n";
        echo "  - Category Name: {$listing->category->name}\n";
        echo "  - Category Slug: {$listing->category->slug}\n";
    }
    echo "Category ID (FK): {$listing->category_id}\n";
    echo "---\n";
}
