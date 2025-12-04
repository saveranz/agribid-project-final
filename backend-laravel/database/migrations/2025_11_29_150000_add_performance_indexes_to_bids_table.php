<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            // Add indexes for faster queries
            $table->index('listing_id');
            $table->index('buyer_id');
            $table->index('is_winning');
            $table->index(['listing_id', 'is_winning'], 'bids_listing_winning_index');
            $table->index(['buyer_id', 'bid_time'], 'bids_buyer_time_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            $table->dropIndex(['listing_id']);
            $table->dropIndex(['buyer_id']);
            $table->dropIndex(['is_winning']);
            $table->dropIndex('bids_listing_winning_index');
            $table->dropIndex('bids_buyer_time_index');
        });
    }
};
