<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateProductImages extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Map product names to specific high-quality agricultural images
        $productImages = [
            // FRUITS
            'Fresh Bananas' => 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=400&fit=crop',
            'Organic Mangoes' => 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=400&fit=crop',
            'Pineapple Bundle' => 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=600&h=400&fit=crop',
            'Papaya Harvest' => 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop',
            'Premium Avocados' => 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop',
            'Watermelon Bundle' => 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=600&h=400&fit=crop',
            'Fresh Oranges' => 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&h=400&fit=crop',
            'Dragon Fruit' => 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=600&h=400&fit=crop',
            
            // VEGETABLES
            'Fresh Tomatoes' => 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&h=400&fit=crop',
            'Organic Lettuce' => 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=400&fit=crop',
            'Eggplant Bundle' => 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
            'Carrots Harvest' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop',
            'Bell Peppers Mix' => 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&h=400&fit=crop',
            'Cabbage Bundle' => 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=400&fit=crop',
            'Potato Sack' => 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop',
            'Okra Fresh' => 'https://images.unsplash.com/photo-1599492013581-a0ae71a4f23f?w=600&h=400&fit=crop',
            
            // GRAINS
            'Rice Harvest' => 'https://images.unsplash.com/photo-1536304929831-e4b8e0619f56?w=600&h=400&fit=crop',
            'Corn Harvest' => 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop',
            'Brown Rice' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
            'Wheat Bundle' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
            'Oats Premium' => 'https://images.unsplash.com/photo-1517098970177-3c76d5a36d4e?w=600&h=400&fit=crop',
            
            // HERBS
            'Fresh Basil' => 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=400&fit=crop',
            'Mint Leaves' => 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&h=400&fit=crop',
            'Oregano Bundle' => 'https://images.unsplash.com/photo-1584278952610-b7a5f0a7f321?w=600&h=400&fit=crop',
            'Rosemary Fresh' => 'https://images.unsplash.com/photo-1595910747748-0668b9e8e5c7?w=600&h=400&fit=crop',
            
            // DAIRY
            'Fresh Milk' => 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop',
            'Cheese Blocks' => 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=400&fit=crop',
            'Butter Fresh' => 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=400&fit=crop',
            
            // POULTRY
            'Free Range Eggs' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop',
            'Live Chickens' => 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=400&fit=crop',
            'Duck Eggs' => 'https://images.unsplash.com/photo-1569288052389-dac9b01c0f17?w=600&h=400&fit=crop',
        ];

        $updatedCount = 0;

        foreach ($productImages as $productName => $imageUrl) {
            $updated = DB::table('listings')
                ->where('name', $productName)
                ->update([
                    'image_url' => $imageUrl,
                    'updated_at' => now(),
                ]);
            
            if ($updated > 0) {
                $updatedCount += $updated;
            }
        }

        $this->command->info("✅ Successfully updated {$updatedCount} product images!");
        $this->command->info('📸 All products now have high-quality agricultural images');
    }
}
