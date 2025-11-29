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
        Schema::create('buyer_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Farmer/seller who gives feedback
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade'); // Buyer who receives feedback
            $table->unsignedBigInteger('transaction_id')->nullable(); // Related transaction (optional)
            $table->foreignId('listing_id')->nullable()->constrained()->onDelete('cascade'); // Related listing
            $table->integer('rating')->unsigned(); // 1-5 star rating
            $table->text('comment')->nullable(); // Feedback comment
            $table->enum('transaction_type', ['purchase', 'bid', 'rental'])->default('purchase');
            
            // Specific rating categories
            $table->integer('payment_speed_rating')->unsigned()->nullable(); // How quickly buyer paid
            $table->integer('communication_rating')->unsigned()->nullable(); // Communication quality
            $table->integer('reliability_rating')->unsigned()->nullable(); // Overall reliability
            
            // Additional metadata
            $table->boolean('would_transact_again')->default(true);
            $table->boolean('is_visible')->default(true); // Sellers can hide feedback
            $table->timestamp('responded_at')->nullable(); // When buyer responded to feedback
            $table->text('buyer_response')->nullable(); // Buyer's response to feedback
            
            $table->timestamps();
            
            // Indexes for efficient queries
            $table->index(['buyer_id', 'rating']);
            $table->index(['seller_id', 'created_at']);
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_feedback');
    }
};
