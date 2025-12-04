<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Equipment;

echo "Total Equipment: " . Equipment::count() . PHP_EOL . PHP_EOL;

$equipment = Equipment::with('owner')->get();

foreach ($equipment as $item) {
    $specs = $item->specifications;
    echo "ID: {$item->id}" . PHP_EOL;
    echo "Name: {$item->name}" . PHP_EOL;
    echo "Type: {$item->type}" . PHP_EOL;
    echo "Rate: ₱{$item->rate_per_day}/day" . PHP_EOL;
    echo "Owner: {$item->owner->name}" . PHP_EOL;
    echo "Status: {$item->availability_status}" . PHP_EOL;
    echo "Rating: " . ($specs['rating'] ?? 'N/A') . PHP_EOL;
    echo "Reviews: " . ($specs['reviews'] ?? 'N/A') . PHP_EOL;
    echo "Image: {$item->image_url}" . PHP_EOL;
    echo "---" . PHP_EOL;
}
