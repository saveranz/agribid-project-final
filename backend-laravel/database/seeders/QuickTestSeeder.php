<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class QuickTestSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create admin user
        $admin = DB::table('users')->where('email', 'admin@agribid.com')->first();
        if (!$admin) {
            DB::table('users')->insert([
                'name' => 'Admin User',
                'email' => 'admin@agribid.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+63 912 345 6779',
                'status' => 'active',
                'verification_status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Get or create farmer user
        $farmer = DB::table('users')->where('email', 'farmer@agribid.com')->first();
        if (!$farmer) {
            $farmerId = DB::table('users')->insertGetId([
                'name' => 'John Farmer',
                'email' => 'farmer@agribid.com',
                'password' => Hash::make('password'),
                'role' => 'farmer',
                'phone' => '+63 912 345 6780',
                'status' => 'active',
                'verification_status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $farmerId = $farmer->id;
        }

        // Get or create buyer user
        $buyer = DB::table('users')->where('email', 'buyer@agribid.com')->first();
        if (!$buyer) {
            $buyerId = DB::table('users')->insertGetId([
                'name' => 'Maria Santos',
                'email' => 'buyer@agribid.com',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '+63 912 345 6781',
                'status' => 'active',
                'verification_status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $buyerId = $buyer->id;
        }

        // Get categories
        $fruits = DB::table('categories')->where('slug', 'fruits')->first();
        $vegetables = DB::table('categories')->where('slug', 'vegetables')->first();
        $grains = DB::table('categories')->where('slug', 'grains')->first();

        // Create listings
        $listings = [
            [
                'farmer_id' => $farmerId,
                'category_id' => $fruits->id,
                'name' => 'Fresh Bananas',
                'description' => 'Premium quality bananas from local farms',
                'type' => 'produce',
                'quantity' => '100',
                'unit' => 'kg',
                'starting_bid' => 5000,
                'current_bid' => 6500,
                'buy_now_price' => 8000,
                'location' => 'Anilao, Oriental Mindoro',
                'auction_start' => now()->subDays(1),
                'auction_end' => now()->addDays(2),
                'status' => 'active',
                'approval_status' => 'approved',
                'views_count' => 45,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'farmer_id' => $farmerId,
                'category_id' => $fruits->id,
                'name' => 'Organic Mangoes',
                'description' => 'Sweet and juicy organic mangoes',
                'type' => 'produce',
                'quantity' => '50',
                'unit' => 'kg',
                'starting_bid' => 8000,
                'current_bid' => 10200,
                'buy_now_price' => 12000,
                'location' => 'Anilao, Oriental Mindoro',
                'auction_start' => now()->subHours(12),
                'auction_end' => now()->addHours(5),
                'status' => 'active',
                'approval_status' => 'approved',
                'views_count' => 67,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'farmer_id' => $farmerId,
                'category_id' => $grains->id,
                'name' => 'Rice Harvest',
                'description' => 'Premium quality white rice',
                'type' => 'produce',
                'quantity' => '500',
                'unit' => 'kg',
                'starting_bid' => 15000,
                'current_bid' => 18000,
                'buy_now_price' => 20000,
                'location' => 'Anilao, Oriental Mindoro',
                'auction_start' => now()->subDays(2),
                'auction_end' => now()->addWeek(),
                'status' => 'active',
                'approval_status' => 'approved',
                'views_count' => 34,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'farmer_id' => $farmerId,
                'category_id' => $vegetables->id,
                'name' => 'Fresh Tomatoes',
                'description' => 'Vine-ripened tomatoes',
                'type' => 'produce',
                'quantity' => '200',
                'unit' => 'kg',
                'starting_bid' => 3500,
                'current_bid' => 4200,
                'buy_now_price' => 5000,
                'location' => 'Anilao, Oriental Mindoro',
                'auction_start' => now()->subDays(1),
                'auction_end' => now()->addDays(3),
                'status' => 'active',
                'approval_status' => 'approved',
                'views_count' => 29,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($listings as $listing) {
            DB::table('listings')->insert($listing);
        }

        echo "✅ Test data seeded successfully!\n";
        echo "📧 Admin: admin@agribid.com / password\n";
        echo "📧 Farmer: farmer@agribid.com / password\n";
        echo "📧 Buyer: buyer@agribid.com / password\n";
    }
}
