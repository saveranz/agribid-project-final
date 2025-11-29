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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('listing_id')->constrained('listings')->onDelete('cascade');
            
            // Order details
            $table->integer('quantity');
            $table->string('unit', 20);
            $table->decimal('price_per_unit', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            
            // Delivery information
            $table->string('delivery_name');
            $table->string('delivery_phone', 20);
            $table->string('delivery_street_address');
            $table->string('delivery_barangay');
            $table->string('delivery_city');
            $table->string('delivery_province');
            $table->string('delivery_postal_code', 10);
            
            // Payment and shipping
            $table->enum('payment_method', ['cod', 'agribidpay', 'gcash', 'paylater'])->default('cod');
            $table->string('shipping_option')->default('standard');
            $table->date('estimated_delivery_start')->nullable();
            $table->date('estimated_delivery_end')->nullable();
            
            // Order status
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending');
            $table->text('message_for_seller')->nullable();
            $table->string('voucher_code')->nullable();
            
            // Tracking
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('buyer_id');
            $table->index('seller_id');
            $table->index('listing_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
