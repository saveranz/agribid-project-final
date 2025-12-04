<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Merge farm_inputs (ID 10) into farm-inputs (ID 9)
        // Update all listings that use farm_inputs to use farm-inputs instead
        DB::table('listings')
            ->where('category_id', 10)
            ->update(['category_id' => 9]);
        
        // Delete the duplicate category
        DB::table('categories')->where('id', 10)->delete();
        
        echo "Merged farm_inputs category into farm-inputs\n";
    }

    public function down()
    {
        // Re-create the farm_inputs category
        DB::table('categories')->insert([
            'id' => 10,
            'name' => 'Farm Inputs',
            'slug' => 'farm_inputs',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Note: We can't restore the original category assignments
        echo "Restored farm_inputs category (but original assignments lost)\n";
    }
};
