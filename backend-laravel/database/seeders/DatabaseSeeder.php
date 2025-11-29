<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test accounts with different roles
        User::create([
            'name' => 'John Farmer',
            'email' => 'farmer@agribid.com',
            'password' => Hash::make('password123'),
            'role' => 'farmer',
        ]);

        User::create([
            'name' => 'Jane Buyer',
            'email' => 'buyer@agribid.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
        ]);

        User::create([
            'name' => 'Mike Renter',
            'email' => 'renter@agribid.com',
            'password' => Hash::make('password123'),
            'role' => 'renter',
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@agribid.com',
            'password' => Hash::make('admin123'),
            'role' => 'farmer',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'test@agribid.com',
            'password' => Hash::make('test123'),
            'role' => 'farmer',
        ]);

        // Seed categories and products
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            ListingsSeeder::class,
        ]);
    }
}
