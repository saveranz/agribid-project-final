<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$listings = \App\Models\Listing::with('farmer')->get();

echo "Total Listings: " . $listings->count() . "\n\n";

foreach ($listings as $listing) {
    echo "ID: {$listing->id}\n";
    echo "Name: {$listing->name}\n";
    echo "Starting Bid: ₱{$listing->starting_bid}\n";
    echo "Current Bid: ₱{$listing->current_bid}\n";
    echo "Status: {$listing->status}\n";
    echo "Approval: {$listing->approval_status}\n";
    echo "Farmer: {$listing->farmer->name}\n";
    echo "---\n";
}
