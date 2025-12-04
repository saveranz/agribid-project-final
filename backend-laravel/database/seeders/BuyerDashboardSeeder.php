<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BuyerDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users or get existing ones
        $admin = DB::table('users')->where('email', 'admin@agribid.com')->first();
        if (!$admin) {
            $adminId = DB::table('users')->insertGetId([
                'name' => 'Admin User',
                'email' => 'admin@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+63 912 345 6789',
                'status' => 'active',
                'verification_status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $adminId = $admin->id;
        }

        $farmer = DB::table('users')->where('email', 'farmer@agribid.com')->first();
        if (!$farmer) {
            $farmerId = DB::table('users')->insertGetId([
                'name' => 'John Farmer',
                'email' => 'farmer@agribid.com',
                'password' => Hash::make('password123'),
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

        $buyer = DB::table('users')->where('email', 'buyer@agribid.com')->first();
        if (!$buyer) {
            $buyerId = DB::table('users')->insertGetId([
                'name' => 'Maria Santos',
                'email' => 'buyer@agribid.com',
                'password' => Hash::make('password123'),
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

        // Get existing categories
        $fruits = DB::table('categories')->where('slug', 'fruits')->first();
        $fruitsId = $fruits ? $fruits->id : 1;
        
        $vegetables = DB::table('categories')->where('slug', 'vegetables')->first();
        $vegetablesId = $vegetables ? $vegetables->id : 2;
        
        $grains = DB::table('categories')->where('slug', 'grains')->first();
        $grainsId = $grains ? $grains->id : 3;

        // Create listings (products)
        $listing1 = DB::table('listings')->insertGetId([
            'farmer_id' => $farmerId,
            'category_id' => $fruitsId,
            'title' => 'Fresh Bananas',
            'description' => 'Premium quality bananas from local farms',
            'quantity' => 100,
            'unit' => 'kg',
            'starting_bid' => 5000,
            'current_bid' => 6500,
            'buy_now_price' => 8000,
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'auction_start' => now()->subDays(1),
            'auction_end' => now()->addDays(2),
            'status' => 'active',
            'approval_status' => 'approved',
            'views_count' => 45,
            'image_url' => 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $listing2 = DB::table('listings')->insertGetId([
            'farmer_id' => $farmerId,
            'category_id' => $fruitsId,
            'title' => 'Organic Mangoes',
            'description' => 'Sweet and juicy organic mangoes',
            'quantity' => 50,
            'unit' => 'kg',
            'starting_bid' => 8000,
            'current_bid' => 10200,
            'buy_now_price' => null,
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'auction_start' => now()->subHours(12),
            'auction_end' => now()->addHours(5),
            'status' => 'active',
            'approval_status' => 'approved',
            'views_count' => 67,
            'image_url' => 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $listing3 = DB::table('listings')->insertGetId([
            'farmer_id' => $farmerId,
            'category_id' => $grainsId,
            'title' => 'Rice Harvest',
            'description' => 'Premium quality white rice',
            'quantity' => 500,
            'unit' => 'kg',
            'starting_bid' => 15000,
            'current_bid' => 18000,
            'buy_now_price' => 20000,
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'auction_start' => now()->subDays(2),
            'auction_end' => now()->addWeek(),
            'status' => 'active',
            'approval_status' => 'approved',
            'views_count' => 34,
            'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $listing4 = DB::table('listings')->insertGetId([
            'farmer_id' => $farmerId,
            'category_id' => $vegetablesId,
            'title' => 'Fresh Tomatoes',
            'description' => 'Vine-ripened tomatoes',
            'quantity' => 200,
            'unit' => 'kg',
            'starting_bid' => 3500,
            'current_bid' => 4200,
            'buy_now_price' => 5000,
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'auction_start' => now()->subDays(1),
            'auction_end' => now()->addDays(3),
            'status' => 'active',
            'approval_status' => 'approved',
            'views_count' => 29,
            'image_url' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create bids
        DB::table('bids')->insert([
            [
                'listing_id' => $listing1,
                'buyer_id' => $buyerId,
                'bid_amount' => 6500,
                'is_winning' => false,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'listing_id' => $listing3,
                'buyer_id' => $buyerId,
                'bid_amount' => 18000,
                'is_winning' => true,
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ],
        ]);

        // Create equipment
        $equipment1 = DB::table('equipment')->insertGetId([
            'owner_id' => $farmerId,
            'name' => 'John Deere Tractor',
            'description' => 'Heavy-duty farming tractor',
            'type' => 'Tractor',
            'rate_per_day' => 3000,
            'availability_status' => 'available',
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'specifications' => json_encode(['horsepower' => '75 HP', 'year' => '2020']),
            'image_url' => 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $equipment2 = DB::table('equipment')->insertGetId([
            'owner_id' => $farmerId,
            'name' => 'Rice Harvester',
            'description' => 'Modern rice harvesting machine',
            'type' => 'Harvester',
            'rate_per_day' => 5000,
            'availability_status' => 'rented',
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'specifications' => json_encode(['capacity' => '2 tons/hour', 'year' => '2021']),
            'image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $equipment3 = DB::table('equipment')->insertGetId([
            'owner_id' => $farmerId,
            'name' => 'Water Pump System',
            'description' => 'High-efficiency irrigation pump',
            'type' => 'Irrigation',
            'rate_per_day' => 800,
            'availability_status' => 'available',
            'location' => 'Anilao, Bongabong, Oriental Mindoro',
            'specifications' => json_encode(['flow_rate' => '100 L/min', 'power' => '5 HP']),
            'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a rental for the buyer
        DB::table('equipment_rentals')->insert([
            'equipment_id' => $equipment3,
            'renter_id' => $buyerId,
            'owner_id' => $farmerId,
            'start_date' => now()->subDays(2),
            'end_date' => now()->addDay(),
            'duration_days' => 3,
            'rate_per_day' => 800,
            'total_cost' => 2400,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create transactions (completed orders)
        DB::table('transactions')->insert([
            [
                'listing_id' => $listing4,
                'buyer_id' => $buyerId,
                'seller_id' => $farmerId,
                'quantity' => 50,
                'unit_price' => 50,
                'total_amount' => 2500,
                'delivery_address' => '123 Main St, Anilao, Oriental Mindoro',
                'payment_method' => 'Cash on Delivery',
                'status' => 'delivered',
                'expected_delivery_date' => now()->subDays(3),
                'delivery_date' => now()->subDay(),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDay(),
            ],
        ]);

        // Create notifications
        DB::table('notifications')->insert([
            [
                'user_id' => $buyerId,
                'type' => 'outbid',
                'message' => "You've been outbid on Fresh Bananas",
                'is_read' => false,
                'created_at' => now()->subMinutes(5),
                'updated_at' => now()->subMinutes(5),
            ],
            [
                'user_id' => $buyerId,
                'type' => 'delivered',
                'message' => 'Your order of Tomatoes has been delivered',
                'is_read' => false,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'user_id' => $buyerId,
                'type' => 'new_listing',
                'message' => 'New produce listing: Premium Rice available',
                'is_read' => false,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'user_id' => $buyerId,
                'type' => 'rental_reminder',
                'message' => 'Reminder: Equipment rental ends tomorrow',
                'is_read' => false,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
        ]);

        // Create favorites
        DB::table('favorites')->insert([
            'user_id' => $buyerId,
            'listing_id' => $listing2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "✅ Sample data seeded successfully!\n";
        echo "📧 Buyer: buyer@agribid.com / password123\n";
        echo "📧 Farmer: farmer@agribid.com / password123\n";
        echo "📧 Admin: admin@agribid.com / password123\n";
    }
}
