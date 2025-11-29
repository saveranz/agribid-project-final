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
            // Add index for user_id (frequently used for "my listings" queries)
            $table->index('user_id');
            
            // Composite index for user's listings by status
            $table->index(['user_id', 'status'], 'listings_user_status_index');
            
            // Composite index for category filtering with status
            $table->index(['category_id', 'status'], 'listings_category_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex('listings_user_status_index');
            $table->dropIndex('listings_category_status_index');
        });
    }
};
