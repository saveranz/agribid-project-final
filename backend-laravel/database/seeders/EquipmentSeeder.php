<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EquipmentSeeder extends Seeder
{
    public function run()
    {
        // Get a farmer user (or create one if doesn't exist)
        $farmer = User::where('role', 'farmer')->first();
        
        if (!$farmer) {
            $farmer = User::create([
                'name' => 'John Farmer',
                'email' => 'farmer@agribid.com',
                'password' => bcrypt('password'),
                'role' => 'farmer',
                'phone' => '09171234567',
                'street_address' => 'Poblacion',
                'barangay' => 'Anilao',
                'city' => 'Bongabong',
                'province' => 'Oriental Mindoro',
                'postal_code' => '5211'
            ]);
        }

        $equipmentData = [
            [
                'name' => 'John Deere 5075E Tractor',
                'description' => 'Powerful 75HP tractor perfect for heavy-duty farming tasks. Includes front loader and excellent for land preparation, plowing, and hauling. Well-maintained and regularly serviced.',
                'type' => 'Tractor',
                'rate_per_day' => 2500.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
                'specifications' => json_encode([
                    'horsepower' => '75HP',
                    'engine_type' => 'Diesel',
                    'transmission' => 'Manual',
                    'condition' => 'Excellent',
                    'bookings' => 12,
                    'rating' => 4.8,
                    'reviews' => 8
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Kubota Rice Combine Harvester',
                'description' => 'Efficient rice harvester suitable for medium to large farms. Reduces harvest time by 80%. Can harvest 2-3 hectares per day. Operator can be provided for additional fee.',
                'type' => 'Harvester',
                'rate_per_day' => 8000.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
                'specifications' => json_encode([
                    'cutting_width' => '1.5m',
                    'capacity' => '2-3 hectares/day',
                    'fuel_type' => 'Diesel',
                    'condition' => 'Very Good',
                    'bookings' => 25,
                    'rating' => 4.9,
                    'reviews' => 15
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Hand Tractor / Rotavator',
                'description' => 'Lightweight and easy-to-use hand tractor for small to medium farms. Perfect for rice paddies, vegetable gardens, and soil preparation. Great fuel efficiency.',
                'type' => 'Tractor',
                'rate_per_day' => 1200.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
                'specifications' => json_encode([
                    'engine' => '8HP Diesel',
                    'working_width' => '80cm',
                    'weight' => '150kg',
                    'condition' => 'Good',
                    'bookings' => 18,
                    'rating' => 4.6,
                    'reviews' => 12
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Knapsack Sprayer (Motorized)',
                'description' => 'Professional-grade motorized sprayer for pesticides and fertilizers. Reduces manual effort and ensures even application. Adjustable nozzle for different spray patterns.',
                'type' => 'Sprayer',
                'rate_per_day' => 500.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
                'specifications' => json_encode([
                    'tank_capacity' => '20L',
                    'engine' => '2-stroke gasoline',
                    'spray_distance' => 'up to 12m',
                    'condition' => 'Excellent',
                    'bookings' => 30,
                    'rating' => 4.7,
                    'reviews' => 20
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Corn Sheller Machine',
                'description' => 'Electric corn sheller that can process 200kg of corn per hour. Save time and labor during harvest season. Perfect for both commercial and home use.',
                'type' => 'Processing Equipment',
                'rate_per_day' => 800.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
                'specifications' => json_encode([
                    'power' => '220V electric motor',
                    'capacity' => '200kg/hour',
                    'material' => 'Stainless steel',
                    'condition' => 'Very Good',
                    'bookings' => 22,
                    'rating' => 4.5,
                    'reviews' => 14
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Rice Thresher (Pedal Type)',
                'description' => 'Traditional pedal-operated rice thresher. No electricity needed. Suitable for small-scale farmers. Can thresh 100-150kg per hour with 2 operators.',
                'type' => 'Thresher',
                'rate_per_day' => 400.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'rented',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
                'specifications' => json_encode([
                    'type' => 'Pedal operated',
                    'capacity' => '100-150kg/hour',
                    'operators_needed' => '2 persons',
                    'condition' => 'Good',
                    'next_available' => '2025-12-08',
                    'bookings' => 15,
                    'rating' => 4.4,
                    'reviews' => 10
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Water Pump (4-inch Centrifugal)',
                'description' => 'Heavy-duty water pump for irrigation. Can draw water from wells, rivers, or ponds. Flow rate of 200 liters per minute. Includes 50 meters of discharge hose.',
                'type' => 'Irrigation',
                'rate_per_day' => 600.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
                'specifications' => json_encode([
                    'engine' => '7HP gasoline',
                    'flow_rate' => '200L/min',
                    'max_head' => '25m',
                    'inlet_outlet' => '4 inches',
                    'condition' => 'Excellent',
                    'bookings' => 28,
                    'rating' => 4.9,
                    'reviews' => 18
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Vegetable Planter/Seeder',
                'description' => 'Manual push-type seeder for vegetables. Creates uniform rows and spacing. Adjustable depth and seed spacing. Includes multiple seed plates for different vegetables.',
                'type' => 'Planter',
                'rate_per_day' => 300.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
                'specifications' => json_encode([
                    'type' => 'Manual push',
                    'row_spacing' => 'Adjustable 15-30cm',
                    'seed_depth' => 'Adjustable 1-5cm',
                    'suitable_for' => 'Most vegetables',
                    'condition' => 'Good',
                    'bookings' => 20,
                    'rating' => 4.6,
                    'reviews' => 13
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Mini Tiller Cultivator',
                'description' => 'Compact tiller perfect for home gardens and small farms. Lightweight and easy to maneuver. Ideal for vegetable beds and flower gardens.',
                'type' => 'Tiller',
                'rate_per_day' => 700.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
                'specifications' => json_encode([
                    'engine' => '5HP gasoline',
                    'tilling_width' => '50cm',
                    'weight' => '60kg',
                    'condition' => 'Very Good',
                    'bookings' => 16,
                    'rating' => 4.5,
                    'reviews' => 11
                ]),
                'is_active' => true,
            ],
            [
                'name' => 'Grass Cutter / Brush Cutter',
                'description' => 'Heavy-duty brush cutter for clearing fields and maintaining land. Can cut thick grass, weeds, and small bushes. Includes safety gear.',
                'type' => 'Maintenance',
                'rate_per_day' => 450.00,
                'location' => 'Anilao, Bongabong, Oriental Mindoro',
                'availability_status' => 'available',
                'owner_id' => $farmer->id,
                'image_url' => 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
                'specifications' => json_encode([
                    'engine' => '2-stroke gasoline',
                    'cutting_diameter' => '40cm',
                    'fuel_tank' => '1.2L',
                    'condition' => 'Excellent',
                    'bookings' => 24,
                    'rating' => 4.7,
                    'reviews' => 16
                ]),
                'is_active' => true,
            ],
        ];

        foreach ($equipmentData as $data) {
            Equipment::create($data);
        }

        echo "Equipment seeder completed successfully! Created " . count($equipmentData) . " equipment items.\n";
    }
}
