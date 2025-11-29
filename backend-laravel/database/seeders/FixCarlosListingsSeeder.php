<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;

class FixCarlosListingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update all Carlos Rodriguez's listings with correct images and location
        $updates = [
            1 => [
                'image_url' => 'https://images.unsplash.com/photo-1605027990121-cbae9fc75c58?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            2 => [
                'image_url' => 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            3 => [
                'image_url' => 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            4 => [
                'image_url' => 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            5 => [
                'image_url' => 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            6 => [
                'image_url' => 'https://images.unsplash.com/photo-1546470427-227e99b8e91a?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            7 => [
                'image_url' => 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            8 => [
                'image_url' => 'https://images.unsplash.com/photo-1628773822990-202c8c4757df?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            9 => [
                'image_url' => 'https://images.unsplash.com/photo-1631256327992-7d3ac4609aa3?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            10 => [
                'image_url' => 'https://images.unsplash.com/photo-1611324008720-3848c15a2c8c?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            11 => [
                'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            12 => [
                'image_url' => 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            13 => [
                'image_url' => 'https://images.unsplash.com/photo-1604681630513-69474a4a3e9d?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            14 => [
                'image_url' => 'https://images.unsplash.com/photo-1599909533166-e0a4e8bb7e4b?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
            15 => [
                'image_url' => 'https://images.unsplash.com/photo-1609159006463-9f8f7d09c3f1?w=800&h=600&fit=crop',
                'location' => 'Anilao, Oriental Mindoro',
            ],
        ];

        $updatedCount = 0;
        foreach ($updates as $listingId => $data) {
            $listing = Listing::find($listingId);
            if ($listing) {
                $listing->image_url = $data['image_url'];
                $listing->location = $data['location'];
                $listing->save();
                $updatedCount++;
            }
        }

        $this->command->info("Successfully updated {$updatedCount} listings with new images and location!");
    }
}
