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
            // Product quality and certification fields
            $table->date('harvest_date')->nullable()->after('description');
            $table->date('expiry_date')->nullable()->after('harvest_date');
            $table->string('quality_grade')->nullable()->after('expiry_date');
            $table->boolean('organic_certified')->default(false)->after('quality_grade');
            $table->boolean('fair_trade_certified')->default(false)->after('organic_certified');
            $table->boolean('gap_certified')->default(false)->after('fair_trade_certified');
            
            // Farm information fields
            $table->string('farm_name')->nullable()->after('gap_certified');
            $table->text('farm_description')->nullable()->after('farm_name');
            
            // Additional product specifications
            $table->string('variety')->nullable()->after('farm_description');
            $table->string('growing_method')->nullable()->after('variety');
            $table->boolean('pesticide_free')->default(true)->after('growing_method');
            $table->text('nutrition_info')->nullable()->after('pesticide_free');
            $table->text('storage_requirements')->nullable()->after('nutrition_info');
            $table->text('shipping_info')->nullable()->after('storage_requirements');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'harvest_date',
                'expiry_date',
                'quality_grade',
                'organic_certified',
                'fair_trade_certified',
                'gap_certified',
                'farm_name',
                'farm_description',
                'variety',
                'growing_method',
                'pesticide_free',
                'nutrition_info',
                'storage_requirements',
                'shipping_info'
            ]);
        });
    }
};
