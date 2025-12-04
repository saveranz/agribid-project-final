<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Equipment table indexes
        Schema::table('equipment', function (Blueprint $table) {
            $table->index('owner_id');
            $table->index('availability_status');
            $table->index('type');
            $table->index('is_active');
            $table->index(['is_active', 'availability_status'], 'equipment_active_status_index');
        });

        // Notifications table indexes
        Schema::table('notifications', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('is_read');
            $table->index('created_at');
            $table->index(['user_id', 'is_read', 'created_at'], 'notifications_user_read_time_index');
        });

        // Favorites table indexes
        Schema::table('favorites', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('listing_id');
            $table->unique(['user_id', 'listing_id'], 'favorites_user_listing_unique');
        });

        // Buyer feedback additional index
        Schema::table('buyer_feedback', function (Blueprint $table) {
            $table->index('listing_id');
        });
    }

    public function down(): void
    {
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropIndex(['owner_id']);
            $table->dropIndex(['availability_status']);
            $table->dropIndex(['type']);
            $table->dropIndex(['is_active']);
            $table->dropIndex('equipment_active_status_index');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['is_read']);
            $table->dropIndex(['created_at']);
            $table->dropIndex('notifications_user_read_time_index');
        });

        Schema::table('favorites', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['listing_id']);
            $table->dropUnique('favorites_user_listing_unique');
        });

        Schema::table('buyer_feedback', function (Blueprint $table) {
            $table->dropIndex(['listing_id']);
        });
    }
};
