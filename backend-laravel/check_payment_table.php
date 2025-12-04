<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== AUCTION_PAYMENTS TABLE STRUCTURE ===\n\n";

$columns = DB::select('DESCRIBE auction_payments');

foreach ($columns as $col) {
    echo "{$col->Field} | {$col->Type} | NULL: {$col->Null} | Key: {$col->Key}\n";
}
