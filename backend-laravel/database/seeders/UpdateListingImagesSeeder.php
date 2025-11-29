<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateListingImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update images for Carlos Rodriguez's listings with better, more accurate product images
        $imageUpdates = [
            // Mangoes - Beautiful ripe carabao mangoes
            1 => 'https://images.unsplash.com/photo-1605027990121-cbae9fc75c58?w=800&h=600&fit=crop',
            
            // Bananas - Fresh yellow bananas
            2 => 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=600&fit=crop',
            
            // Papaya - Ripe papaya cut open
            3 => 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=600&fit=crop',
            
            // Pineapple - Fresh whole pineapple
            4 => 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=600&fit=crop',
            
            // Calamansi/Citrus - Small citrus fruits
            5 => 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=600&fit=crop',
            
            // Tomatoes - Fresh red tomatoes
            6 => 'https://images.unsplash.com/photo-1546470427-227e99b8e91a?w=800&h=600&fit=crop',
            
            // Eggplant - Purple eggplants
            7 => 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&h=600&fit=crop',
            
            // String Beans (Sitaw) - Green beans
            8 => 'https://images.unsplash.com/photo-1628773822990-202c8c4757df?w=800&h=600&fit=crop',
            
            // Bitter Gourd (Ampalaya) - Green bitter melon
            9 => 'https://images.unsplash.com/photo-1631256327992-7d3ac4609aa3?w=800&h=600&fit=crop',
            
            // Okra - Fresh okra
            10 => 'https://images.unsplash.com/photo-1611324008720-3848c15a2c8c?w=800&h=600&fit=crop',
            
            // White Rice - Rice grains in bowl
            11 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
            
            // Corn - Fresh yellow corn
            12 => 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&h=600&fit=crop',
            
            // Sweet Potatoes - Orange sweet potatoes
            13 => 'https://images.unsplash.com/photo-1604681630513-69474a4a3e9d?w=800&h=600&fit=crop',
            
            // Ginger - Fresh ginger root
            14 => 'https://images.unsplash.com/photo-1599909533166-e0a4e8bb7e4b?w=800&h=600&fit=crop',
            
            // Lemongrass - Fresh lemongrass stalks
            15 => 'https://images.unsplash.com/photo-1609159006463-9f8f7d09c3f1?w=800&h=600&fit=crop',
        ];

        $updated = 0;
        foreach ($imageUpdates as $listingId => $imageUrl) {
            $result = DB::table('listings')
                ->where('id', $listingId)
                ->update(['image_url' => $imageUrl]);
            
            if ($result) {
                $updated++;
            }
        }

        $this->command->info("Successfully updated {$updated} listing images with actual product photos!");
    }
}
