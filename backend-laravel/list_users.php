<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$users = User::all();

echo "Total Users: " . $users->count() . PHP_EOL . PHP_EOL;

foreach ($users as $user) {
    echo "Email: {$user->email}" . PHP_EOL;
    echo "Name: {$user->name}" . PHP_EOL;
    echo "Role: {$user->role}" . PHP_EOL;
    echo "---" . PHP_EOL;
}
