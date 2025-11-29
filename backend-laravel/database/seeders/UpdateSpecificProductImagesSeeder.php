<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;

class UpdateSpecificProductImagesSeeder extends Seeder
{
    public function run(): void
    {
        // Get the listings by name and update with verified working Unsplash images
        $updates = [
            'Premium Carabao Mangoes' => 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
            'Fresh Tomatoes' => 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
            'Okra Fresh' => 'https://images.unsplash.com/photo-1628773822990-202c8c4757df?auto=format&fit=crop&w=800&q=80',
            'Sitaw (String Beans)' => 'https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?auto=format&fit=crop&w=800&q=80',
            'Sweet Potatoes (Kamote)' => 'https://images.unsplash.com/photo-1589927986089-35812378d4be?auto=format&fit=crop&w=800&q=80',
            'Fresh Ginger' => 'https://images.unsplash.com/photo-1591719980-faee80ff32fc?auto=format&fit=crop&w=800&q=80',
            'Lemongrass (Tanglad)' => 'https://images.unsplash.com/photo-1618638942557-1a8d2a8fc88f?auto=format&fit=crop&w=800&q=80',
        ];

        $updated = 0;
        foreach ($updates as $name => $imageUrl) {
            $listing = Listing::where('name', $name)->where('user_id', 1)->first();
            if ($listing) {
                $listing->image_url = $imageUrl;
                $listing->save();
                $updated++;
                $this->command->info("Updated: {$name}");
            }
        }

        $this->command->info("Successfully updated {$updated} product images!");
    }
}
