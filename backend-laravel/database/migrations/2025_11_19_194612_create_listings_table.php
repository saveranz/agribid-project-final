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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type');
            $table->string('quantity');
            $table->string('unit');
            $table->decimal('starting_bid', 10, 2)->nullable();
            $table->decimal('current_bid', 10, 2)->nullable();
            $table->decimal('buy_now_price', 10, 2)->nullable();
            $table->string('location');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->dateTime('auction_start')->nullable();
            $table->dateTime('auction_end')->nullable();
            $table->enum('status', ['active', 'sold', 'expired', 'cancelled'])->default('active');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
