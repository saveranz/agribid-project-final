<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;

class AddCacheBusterToImagesSeeder extends Seeder
{
    public function run(): void
    {
        $listings = Listing::where('user_id', 1)->get();
        $timestamp = time();
        
        foreach ($listings as $listing) {
            $url = $listing->image_url;
            
            // Remove any existing query parameters and add fresh cache buster
            $url = strtok($url, '?');
            $listing->image_url = $url . '?w=800&h=600&fit=crop&v=' . $timestamp;
            $listing->save();
        }

        $this->command->info("Updated {$listings->count()} listings with cache-busting parameters!");
    }
}
