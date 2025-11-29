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
        Schema::table('listings', function (Blueprint $table) {
            // Index for filtering by status (most common query)
            $table->index('status');
            
            // Index for filtering by listing_type (auction vs direct_buy)
            $table->index('listing_type');
            
            // Index for filtering by approval_status
            $table->index('approval_status');
            
            // Composite index for common query: status + listing_type + auction_end
            $table->index(['status', 'listing_type', 'auction_end'], 'listings_status_type_end_index');
            
            // Index for sorting by created_at (newest first)
            $table->index('created_at');
            
            // Index for location-based searches
            $table->index('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['listing_type']);
            $table->dropIndex(['approval_status']);
            $table->dropIndex('listings_status_type_end_index');
            $table->dropIndex(['created_at']);
            $table->dropIndex(['location']);
        });
    }
};
