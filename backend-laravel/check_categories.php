<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CATEGORIES IN DATABASE ===\n\n";

$categories = \App\Models\Category::all();

foreach ($categories as $cat) {
    $directBuyCount = \App\Models\Listing::where('listing_type', 'direct_buy')
        ->where('category_id', $cat->id)
        ->where('status', 'active')
        ->where('approval_status', 'approved')
        ->count();
        
    $auctionCount = \App\Models\Listing::where('listing_type', 'auction')
        ->where('category_id', $cat->id)
        ->where('status', 'active')
        ->where('approval_status', 'approved')
        ->count();
    
    echo "ID: {$cat->id}\n";
    echo "Name: {$cat->name}\n";
    echo "Slug: {$cat->slug}\n";
    echo "Direct Buy: {$directBuyCount} | Auction: {$auctionCount}\n";
    echo "---\n";
}
