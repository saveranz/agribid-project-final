<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Vegetables', 'slug' => 'vegetables', 'description' => 'Fresh vegetables and greens'],
            ['name' => 'Fruits', 'slug' => 'fruits', 'description' => 'Fresh fruits and berries'],
            ['name' => 'Grains', 'slug' => 'grains', 'description' => 'Rice, wheat, corn and other grains'],
            ['name' => 'Farm Inputs', 'slug' => 'farm_inputs', 'description' => 'Fertilizers, pesticides, seeds and other agricultural inputs'],
            ['name' => 'Herbs', 'slug' => 'herbs', 'description' => 'Fresh herbs and spices'],
            ['name' => 'Dairy', 'slug' => 'dairy', 'description' => 'Dairy products'],
            ['name' => 'Poultry', 'slug' => 'poultry', 'description' => 'Poultry and eggs'],
            ['name' => 'Livestock', 'slug' => 'livestock', 'description' => 'Livestock and meat products'],
            ['name' => 'Organic', 'slug' => 'organic', 'description' => 'Certified organic products'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
