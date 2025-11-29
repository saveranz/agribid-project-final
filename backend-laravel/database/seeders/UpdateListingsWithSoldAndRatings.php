<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateListingsWithSoldAndRatings extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all active and approved listings
        $listings = DB::table('listings')
            ->where('approval_status', 'approved')
            ->get();

        foreach ($listings as $listing) {
            // Generate random but realistic sold count (between 15-150)
            $soldCount = rand(15, 150);
            
            // Generate realistic ratings (between 3.5 and 5.0)
            $rating = number_format(rand(35, 50) / 10, 1);
            
            DB::table('listings')
                ->where('id', $listing->id)
                ->update([
                    'sold_count' => $soldCount,
                    'rating' => $rating,
                    'updated_at' => now(),
                ]);
        }

        $this->command->info('✅ Successfully updated ' . $listings->count() . ' listings with sold counts and ratings!');
        $this->command->info('📊 Sold counts: 15-150 per listing');
        $this->command->info('⭐ Ratings: 3.5-5.0 stars');
    }
}
