<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Testing Authentication\n";
echo "======================\n\n";

$users = User::all(['name', 'email', 'role']);

foreach ($users as $user) {
    echo "User: {$user->name}\n";
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    
    $fullUser = User::where('email', $user->email)->first();
    $passwordCheck = Hash::check('password', $fullUser->password);
    echo "Password 'password' valid: " . ($passwordCheck ? 'YES ✓' : 'NO ✗') . "\n";
    echo "---\n\n";
}
