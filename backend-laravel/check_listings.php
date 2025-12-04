<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DIRECT BUY LISTINGS (Approved Only) ===\n\n";

$directBuy = \App\Models\Listing::with(['category', 'farmer'])
    ->where('listing_type', 'direct_buy')
    ->where('status', 'active')
    ->where('approval_status', 'approved')
    ->take(15)
    ->get();

foreach ($directBuy as $listing) {
    $categoryName = $listing->category ? $listing->category->name : 'No Category';
    $categorySlug = $listing->category ? $listing->category->slug : 'N/A';
    
    echo "ID: {$listing->id}\n";
    echo "Name: {$listing->name}\n";
    echo "Category: {$categoryName} ({$categorySlug})\n";
    echo "Price: ₱{$listing->price}\n";
    echo "---\n";
}

echo "\n=== CATEGORY COUNTS (Direct Buy) ===\n";
$categories = \App\Models\Category::all();
foreach ($categories as $cat) {
    $count = \App\Models\Listing::where('listing_type', 'direct_buy')
        ->where('category_id', $cat->id)
        ->where('status', 'active')
        ->where('approval_status', 'approved')
        ->count();
    
    if ($count > 0) {
        echo "{$cat->name} ({$cat->slug}): {$count} items\n";
    }
}
