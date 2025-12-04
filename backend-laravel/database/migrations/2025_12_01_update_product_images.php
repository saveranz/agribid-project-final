<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update listings with proper product image URLs
        $listings = [
            ['name' => 'Oats', 'image' => 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=800&h=600&fit=crop'],
            ['name' => 'Barley', 'image' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop'],
            ['name' => 'Premium White Rice', 'image' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop'],
            ['name' => 'Millet', 'image' => 'https://images.unsplash.com/photo-1599909533166-e0a4e8bb7e4b?w=800&h=600&fit=crop'],
            ['name' => 'Buckwheat', 'image' => 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=600&fit=crop'],
            ['name' => 'Fresh Basil', 'image' => 'https://images.unsplash.com/photo-1618375569909-3c8616cf7e55?w=800&h=600&fit=crop'],
            ['name' => 'Lemongrass', 'image' => 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=600&fit=crop'],
            ['name' => 'Fresh Mint', 'image' => 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&h=600&fit=crop'],
            ['name' => 'Rosemary', 'image' => 'https://images.unsplash.com/photo-1584278373312-de3db5266d37?w=800&h=600&fit=crop'],
            ['name' => 'Thyme', 'image' => 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=600&fit=crop'],
            ['name' => 'Cilantro', 'image' => 'https://images.unsplash.com/photo-1566281796817-93bc94d7dbd2?w=800&h=600&fit=crop'],
            ['name' => 'Dill', 'image' => 'https://images.unsplash.com/photo-1584278373312-de3db5266d37?w=800&h=600&fit=crop'],
        ];

        foreach ($listings as $listing) {
            DB::table('listings')
                ->where('name', 'LIKE', '%' . $listing['name'] . '%')
                ->update(['image_url' => $listing['image']]);
        }
    }

    public function down(): void
    {
        // No rollback needed
    }
};
