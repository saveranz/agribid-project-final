<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApproveListingSeeder extends Seeder
{
    public function run(): void
    {
        // Approve all pending listings
        DB::table('listings')
            ->where('approval_status', 'pending')
            ->update([
                'approval_status' => 'approved',
                'status' => 'active'
            ]);
        
        echo "All pending listings have been approved!\n";
    }
}
