<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== TESTING DIRECT BUY API ENDPOINT ===\n\n";

// Simulate the exact query used by directBuyListings() method
$query = \App\Models\Listing::with(['user', 'category', 'bids'])
    ->where('listing_type', 'direct_buy')
    ->where('status', 'active')
    ->where('approval_status', 'approved');

$total = $query->count();
echo "Total Direct Buy Listings: {$total}\n\n";

// Get category breakdown
echo "=== CATEGORY BREAKDOWN ===\n";
$categories = DB::table('categories')
    ->select('categories.id', 'categories.name', 'categories.slug')
    ->selectRaw('COUNT(listings.id) as count')
    ->leftJoin('listings', function($join) {
        $join->on('listings.category_id', '=', 'categories.id')
             ->where('listings.listing_type', '=', 'direct_buy')
             ->where('listings.status', '=', 'active')
             ->where('listings.approval_status', '=', 'approved');
    })
    ->groupBy('categories.id', 'categories.name', 'categories.slug')
    ->having('count', '>', 0)
    ->get();

foreach ($categories as $cat) {
    echo "{$cat->name} ({$cat->slug}): {$cat->count} products\n";
}

echo "\n=== SAMPLE PRODUCTS BY CATEGORY ===\n";
foreach ($categories as $cat) {
    echo "\n{$cat->name}:\n";
    $products = \App\Models\Listing::where('category_id', $cat->id)
        ->where('listing_type', 'direct_buy')
        ->where('status', 'active')
        ->where('approval_status', 'approved')
        ->take(3)
        ->pluck('name');
    
    foreach ($products as $name) {
        echo "  - {$name}\n";
    }
}
