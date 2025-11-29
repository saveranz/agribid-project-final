<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Bid;
use App\Models\StockBatch;
use Carbon\Carbon;

class ListingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a farmer user
        $farmer = User::where('role', 'farmer')->first();
        if (!$farmer) {
            $farmer = User::create([
                'name' => 'Juan dela Cruz',
                'email' => 'farmer@agribid.com',
                'password' => bcrypt('password123'),
                'role' => 'farmer',
                'phone' => '09171234567',
                'street_address' => 'Barangay San Jose',
                'barangay' => 'San Jose',
                'city' => 'Lipa City',
                'province' => 'Batangas',
                'postal_code' => '4217',
            ]);
        }

        // Get or create a buyer user
        $buyer = User::where('role', 'buyer')->first();
        if (!$buyer) {
            $buyer = User::create([
                'name' => 'Maria Santos',
                'email' => 'buyer@agribid.com',
                'password' => bcrypt('password123'),
                'role' => 'buyer',
                'phone' => '09187654321',
                'street_address' => 'Poblacion',
                'barangay' => 'Poblacion',
                'city' => 'Tanauan City',
                'province' => 'Batangas',
                'postal_code' => '4232',
            ]);
        }

        // Get categories
        $categories = [
            'Vegetables' => Category::firstOrCreate(['name' => 'Vegetables'], ['name' => 'Vegetables', 'icon' => '🥬']),
            'Fruits' => Category::firstOrCreate(['name' => 'Fruits'], ['name' => 'Fruits', 'icon' => '🍎']),
            'Grains' => Category::firstOrCreate(['name' => 'Grains'], ['name' => 'Grains', 'icon' => '🌾']),
            'Poultry' => Category::firstOrCreate(['name' => 'Poultry'], ['name' => 'Poultry', 'icon' => '🐔']),
        ];

        // Sample listings data
        $listings = [
            // AUCTION LISTINGS
            [
                'name' => 'Premium Queen Pineapples',
                'description' => 'Sweet and juicy Queen variety pineapples, freshly harvested from our farm. Perfect for fresh consumption or processing. Grade A quality with golden yellow color.',
                'category_id' => $categories['Fruits']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'auction',
                'quantity' => 200,
                'unit' => 'kg',
                'starting_bid' => 1500.00,
                'current_bid' => 2000.00,
                'location' => 'Lipa City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80',
                'auction_start' => Carbon::now()->subDays(2),
                'auction_end' => Carbon::now()->addDays(3),
                'harvest_date' => Carbon::now()->subDays(5),
                'quality_grade' => 'Grade A Premium',
                'organic_certified' => true,
                'variety' => 'Queen Pineapple',
                'growing_method' => 'organic',
            ],
            [
                'name' => 'Fresh Organic Lettuce',
                'description' => 'Crisp and fresh organic lettuce, hydroponically grown. Perfect for salads and sandwiches. Chemical-free and pesticide-free.',
                'category_id' => $categories['Vegetables']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'auction',
                'quantity' => 50,
                'unit' => 'kg',
                'starting_bid' => 300.00,
                'current_bid' => 500.00,
                'location' => 'Tanauan City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80',
                'auction_start' => Carbon::now()->subDays(1),
                'auction_end' => Carbon::now()->addDays(2),
                'harvest_date' => Carbon::now()->subDays(3),
                'quality_grade' => 'Grade A Premium',
                'organic_certified' => true,
                'variety' => 'Green Leaf Lettuce',
                'growing_method' => 'hydroponic',
            ],
            [
                'name' => 'Premium Jasmine Rice',
                'description' => 'Fragrant jasmine rice from our paddies. Newly harvested, cleaned, and dried to perfection. Long grain with excellent aroma.',
                'category_id' => $categories['Grains']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'auction',
                'quantity' => 500,
                'unit' => 'kg',
                'starting_bid' => 15000.00,
                'current_bid' => 18000.00,
                'location' => 'Lipa City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
                'auction_start' => Carbon::now()->subHours(12),
                'auction_end' => Carbon::now()->addDays(5),
                'harvest_date' => Carbon::now()->subDays(10),
                'quality_grade' => 'Grade A Premium',
                'variety' => 'Jasmine Rice',
                'growing_method' => 'traditional',
            ],

            // DIRECT BUY LISTINGS WITH STOCK BATCHES
            [
                'name' => 'Fresh Ripe Tomatoes',
                'description' => 'Vine-ripened tomatoes, perfect for cooking and salads. Grown with natural farming methods. Rich in flavor and nutrients.',
                'category_id' => $categories['Vegetables']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'direct_buy',
                'quantity' => 300,
                'unit' => 'kg',
                'buy_now_price' => 45.00,
                'location' => 'Lipa City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
                'harvest_date' => Carbon::now()->subDays(2),
                'quality_grade' => 'Grade A Premium',
                'variety' => 'Roma Tomatoes',
                'growing_method' => 'traditional',
            ],
            [
                'name' => 'Organic Carrots',
                'description' => 'Fresh organic carrots, sweet and crunchy. Perfect for juicing, cooking, or raw consumption. Grown without chemicals.',
                'category_id' => $categories['Vegetables']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'direct_buy',
                'quantity' => 150,
                'unit' => 'kg',
                'buy_now_price' => 60.00,
                'location' => 'Tanauan City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
                'harvest_date' => Carbon::now()->subDays(1),
                'quality_grade' => 'Grade A Premium',
                'organic_certified' => true,
                'variety' => 'Imperator Carrot',
                'growing_method' => 'organic',
            ],
            [
                'name' => 'Sweet Corn',
                'description' => 'Freshly picked sweet corn, bursting with natural sweetness. Great for grilling, boiling, or making corn soup. Locally grown.',
                'category_id' => $categories['Vegetables']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'direct_buy',
                'quantity' => 200,
                'unit' => 'kg',
                'buy_now_price' => 35.00,
                'location' => 'Lipa City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
                'harvest_date' => Carbon::now()->subHours(18),
                'quality_grade' => 'Grade A Premium',
                'variety' => 'Sweet Yellow Corn',
                'growing_method' => 'traditional',
            ],
            [
                'name' => 'Fresh Cavendish Bananas',
                'description' => 'Premium Cavendish bananas, perfectly ripe and ready to eat. Sweet and creamy texture. Excellent for snacks or smoothies.',
                'category_id' => $categories['Fruits']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'direct_buy',
                'quantity' => 400,
                'unit' => 'kg',
                'buy_now_price' => 55.00,
                'location' => 'Lipa City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
                'harvest_date' => Carbon::now()->subDays(4),
                'quality_grade' => 'Grade A Premium',
                'variety' => 'Cavendish',
                'growing_method' => 'traditional',
            ],
            [
                'name' => 'Farm Fresh Eggs',
                'description' => 'Free-range chicken eggs from our farm. Rich in nutrients and flavor. Chickens are raised naturally without antibiotics.',
                'category_id' => $categories['Poultry']->id,
                'user_id' => $farmer->id,
                'type' => 'produce',
                'listing_type' => 'direct_buy',
                'quantity' => 500,
                'unit' => 'pieces',
                'buy_now_price' => 8.00,
                'location' => 'Tanauan City, Batangas',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80',
                'harvest_date' => Carbon::now(),
                'quality_grade' => 'Grade A Premium',
                'variety' => 'Free Range Eggs',
                'growing_method' => 'free-range',
            ],
        ];

        foreach ($listings as $listingData) {
            $listing = Listing::create($listingData);

            // Add bids to auction listings
            if ($listing->listing_type === 'auction') {
                // Add some sample bids
                Bid::create([
                    'listing_id' => $listing->id,
                    'buyer_id' => $buyer->id,
                    'bid_amount' => $listing->starting_bid,
                    'is_winning' => false,
                    'bid_time' => Carbon::now()->subHours(6),
                ]);

                Bid::create([
                    'listing_id' => $listing->id,
                    'buyer_id' => $buyer->id,
                    'bid_amount' => $listing->current_bid,
                    'is_winning' => true,
                    'bid_time' => Carbon::now()->subHours(3),
                ]);
            }

            // Add stock batches to direct buy listings
            if ($listing->listing_type === 'direct_buy') {
                // Create tiered pricing batches
                $totalQuantity = $listing->quantity;
                $basePrice = $listing->buy_now_price;

                // Tier 1: 1-10 kg (highest price)
                StockBatch::create([
                    'listing_id' => $listing->id,
                    'quantity' => min(10, $totalQuantity),
                    'remaining_quantity' => min(10, $totalQuantity),
                    'price' => $basePrice,
                    'batch_date' => $listing->harvest_date ?? Carbon::now(),
                    'batch_number' => 'TIER-1-10-' . time(),
                    'notes' => 'Bulk pricing tier: 1-10 ' . $listing->unit,
                ]);

                // Tier 2: 11-50 kg (5% discount)
                if ($totalQuantity > 10) {
                    StockBatch::create([
                        'listing_id' => $listing->id,
                        'quantity' => min(40, $totalQuantity - 10),
                        'remaining_quantity' => min(40, $totalQuantity - 10),
                        'price' => $basePrice * 0.95,
                        'batch_date' => $listing->harvest_date ?? Carbon::now(),
                        'batch_number' => 'TIER-11-50-' . time(),
                        'notes' => 'Bulk pricing tier: 11-50 ' . $listing->unit,
                    ]);
                }

                // Tier 3: 51-100 kg (10% discount)
                if ($totalQuantity > 50) {
                    StockBatch::create([
                        'listing_id' => $listing->id,
                        'quantity' => min(50, $totalQuantity - 50),
                        'remaining_quantity' => min(50, $totalQuantity - 50),
                        'price' => $basePrice * 0.90,
                        'batch_date' => $listing->harvest_date ?? Carbon::now(),
                        'batch_number' => 'TIER-51-100-' . time(),
                        'notes' => 'Bulk pricing tier: 51-100 ' . $listing->unit,
                    ]);
                }

                // Tier 4: 100+ kg (15% discount)
                if ($totalQuantity > 100) {
                    StockBatch::create([
                        'listing_id' => $listing->id,
                        'quantity' => $totalQuantity - 100,
                        'remaining_quantity' => $totalQuantity - 100,
                        'price' => $basePrice * 0.85,
                        'batch_date' => $listing->harvest_date ?? Carbon::now(),
                        'batch_number' => 'TIER-100-' . time(),
                        'notes' => 'Bulk pricing tier: 100+ ' . $listing->unit,
                    ]);
                }
            }
        }

        $this->command->info('✅ Successfully seeded ' . count($listings) . ' listings with sample data!');
        $this->command->info('📧 Farmer Login: farmer@agribid.com / password123');
        $this->command->info('📧 Buyer Login: buyer@agribid.com / password123');
    }
}
