<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== TESTING CATEGORY SLUG MATCHING ===\n\n";

// Get some fruits products
$fruits = \App\Models\Listing::with('category')
    ->where('category_id', 1)
    ->where('listing_type', 'direct_buy')
    ->where('status', 'active')
    ->where('approval_status', 'approved')
    ->take(5)
    ->get();

echo "Fruits in database:\n";
foreach ($fruits as $fruit) {
    echo "- {$fruit->name}\n";
    echo "  category_id: {$fruit->category_id}\n";
    echo "  category->slug: {$fruit->category->slug}\n";
    
    // Test the frontend normalization
    $productCategory = strtolower($fruit->category->slug);
    $productCategory = str_replace('-', '_', $productCategory);
    
    $selectedCat = 'fruits'; // This is what frontend sends
    $selectedCat = str_replace('-', '_', $selectedCat);
    
    echo "  After normalization: '{$productCategory}' === '{$selectedCat}' ? ";
    echo ($productCategory === $selectedCat ? "YES ✓" : "NO ✗") . "\n\n";
}

echo "\n=== ALL CATEGORY SLUGS ===\n";
$categories = DB::table('categories')->get();
foreach ($categories as $cat) {
    $normalized = strtolower(str_replace('-', '_', $cat->slug));
    echo "ID: {$cat->id} | Name: {$cat->name} | Slug: '{$cat->slug}' | Normalized: '{$normalized}'\n";
}
