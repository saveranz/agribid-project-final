<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update all listing locations to Anilao, Bongabong, Oriental Mindoro
        DB::table('listings')->update([
            'location' => 'Anilao, Bongabong, Oriental Mindoro'
        ]);
    }

    public function down(): void
    {
        // No rollback needed
    }
};
