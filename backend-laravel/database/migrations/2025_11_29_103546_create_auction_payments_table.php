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
            $table->foreignId('bid_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            
            // Payment details
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['downpayment', 'partial', 'final', 'full']);
            $table->enum('payment_method', ['cod', 'agribidpay', 'gcash', 'bank_transfer', 'cash']);
            $table->string('payment_reference')->nullable(); // Transaction ID or reference number
            $table->string('payment_proof')->nullable(); // Upload proof of payment
            
            // Payment status
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Timestamps
            $table->timestamp('payment_date');
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes
            $table->index(['bid_id', 'buyer_id']);
            $table->index(['seller_id', 'status']);
            $table->index(['listing_id']);
        });

        // Add payment tracking fields to bids table
        Schema::table('bids', function (Blueprint $table) {
            $table->decimal('winning_bid_amount', 10, 2)->nullable()->after('bid_amount');
            $table->decimal('total_paid', 10, 2)->default(0)->after('winning_bid_amount');
            $table->decimal('remaining_balance', 10, 2)->nullable()->after('total_paid');
            $table->decimal('minimum_downpayment', 10, 2)->nullable()->after('remaining_balance');
            $table->enum('payment_status', ['unpaid', 'partial', 'paid', 'overdue'])->default('unpaid')->after('minimum_downpayment');
            $table->timestamp('payment_deadline')->nullable()->after('payment_status');
            $table->timestamp('full_payment_date')->nullable()->after('payment_deadline');
            $table->enum('fulfillment_status', ['pending', 'ready_for_pickup', 'in_transit', 'delivered', 'completed'])->default('pending')->after('full_payment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            $table->dropColumn([
                'winning_bid_amount',
                'total_paid',
                'remaining_balance',
                'minimum_downpayment',
                'payment_status',
                'payment_deadline',
                'full_payment_date',
                'fulfillment_status'
            ]);
        });
        
        Schema::dropIfExists('auction_payments');
    }
};
