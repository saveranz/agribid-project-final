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
        Schema::create('auction_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bid_id')->constrained('bids')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['downpayment', 'balance', 'full'])->default('full');
            $table->enum('payment_method', ['cash', 'gcash', 'bank_transfer', 'card'])->default('cash');
            $table->string('confirmation_id')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            $table->index('bid_id');
            $table->index('buyer_id');
            $table->index('seller_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_payments');
    }
};
