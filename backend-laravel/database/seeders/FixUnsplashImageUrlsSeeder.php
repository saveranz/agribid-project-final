<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;

class FixUnsplashImageUrlsSeeder extends Seeder
{
    public function run(): void
    {
        // Correct Unsplash image URLs with proper parameters
        $imageUrls = [
            // Mangoes
            1 => 'https://images.unsplash.com/photo-1605027990121-cbae9fc75c58?auto=format&fit=crop&w=800&q=80',
            
            // Bananas
            2 => 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
            
            // Papaya
            3 => 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
            
            // Pineapple
            4 => 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
            
            // Calamansi/Oranges
            5 => 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
            
            // Tomatoes
            6 => 'https://images.unsplash.com/photo-1546470427-227e99b8e91a?auto=format&fit=crop&w=800&q=80',
            
            // Eggplant
            7 => 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80',
            
            // Green Beans
            8 => 'https://images.unsplash.com/photo-1560270418-5c0053f9bbee?auto=format&fit=crop&w=800&q=80',
            
            // Bitter Gourd
            9 => 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80',
            
            // Okra
            10 => 'https://images.unsplash.com/photo-1599343182988-ba4f6163bbc0?auto=format&fit=crop&w=800&q=80',
            
            // Rice
            11 => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
            
            // Corn
            12 => 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
            
            // Sweet Potatoes
            13 => 'https://images.unsplash.com/photo-1589927986089-35812378d4be?auto=format&fit=crop&w=800&q=80',
            
            // Ginger
            14 => 'https://images.unsplash.com/photo-1599909533166-e0a4e8bb7e4b?auto=format&fit=crop&w=800&q=80',
            
            // Lemongrass
            15 => 'https://images.unsplash.com/photo-1609159006463-9f8f7d09c3f1?auto=format&fit=crop&w=800&q=80',
        ];

        $updated = 0;
        foreach ($imageUrls as $listingId => $imageUrl) {
            $listing = Listing::find($listingId);
            if ($listing) {
                $listing->image_url = $imageUrl;
                $listing->save();
                $updated++;
            }
        }

        $this->command->info("Successfully updated {$updated} listings with correct Unsplash URLs!");
    }
}
