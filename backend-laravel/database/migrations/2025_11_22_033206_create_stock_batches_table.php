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
        Schema::create('stock_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->onDelete('cascade');
            $table->integer('quantity'); // Quantity in this batch
            $table->integer('remaining_quantity'); // Remaining quantity in this batch
            $table->decimal('price', 10, 2); // Price per unit for this batch
            $table->date('batch_date'); // Date when this batch was added
            $table->string('batch_number')->nullable(); // Optional batch reference number
            $table->text('notes')->nullable(); // Optional notes about this batch
            $table->enum('status', ['active', 'sold_out', 'expired'])->default('active');
            $table->timestamps();
            
            // Index for efficient queries
            $table->index(['listing_id', 'status']);
            $table->index(['listing_id', 'price']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_batches');
    }
};
