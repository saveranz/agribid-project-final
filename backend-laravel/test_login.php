<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Testing login credentials...\n\n";

$user = User::where('email', 'farmer@agribid.com')->first();

if ($user) {
    echo "✓ User found: {$user->name}\n";
    echo "  Email: {$user->email}\n";
    echo "  Role: {$user->role}\n";
    
    $passwordValid = Hash::check('password123', $user->password);
    echo "  Password 'password123': " . ($passwordValid ? "✓ VALID" : "✗ INVALID") . "\n\n";
} else {
    echo "✗ User not found!\n\n";
}

// Test all users
echo "All users in database:\n";
$users = User::all();
foreach ($users as $u) {
    echo "  - {$u->email} ({$u->role})\n";
}

echo "\nTotal users: " . $users->count() . "\n";
