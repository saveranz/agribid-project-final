<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Farmers - 10 users
        $farmers = [
            [
                'name' => 'Carlos Rodriguez',
                'email' => 'carlos.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Roberto Cruz',
                'email' => 'roberto.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Ana Reyes',
                'email' => 'ana.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Jose Garcia',
                'email' => 'jose.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Linda Manalo',
                'email' => 'linda.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Ramon Dela Cruz',
                'email' => 'ramon.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Sofia Martinez',
                'email' => 'sofia.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Pedro Villareal',
                'email' => 'pedro.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
            [
                'name' => 'Carmen Aquino',
                'email' => 'carmen.farmer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'farmer',
            ],
        ];

        // Buyers - 10 users
        $buyers = [
            [
                'name' => 'James Wilson',
                'email' => 'james.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Sarah Chen',
                'email' => 'sarah.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Michael Torres',
                'email' => 'michael.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Emily Rodriguez',
                'email' => 'emily.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'David Kim',
                'email' => 'david.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Jessica Tan',
                'email' => 'jessica.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Robert Nguyen',
                'email' => 'robert.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Michelle Lee',
                'email' => 'michelle.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Daniel Patel',
                'email' => 'daniel.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
            [
                'name' => 'Angela Rivera',
                'email' => 'angela.buyer@agribid.com',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
            ],
        ];

        // Admin User
        $admin = [
            'name' => 'Admin User',
            'email' => 'admin@agribid.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ];

        // Insert admin
        User::create($admin);

        // Insert farmers
        foreach ($farmers as $farmer) {
            User::create($farmer);
        }

        // Insert buyers
        foreach ($buyers as $buyer) {
            User::create($buyer);
        }

        $this->command->info('Created 1 admin, 10 farmers and 10 buyers successfully!');
    }
}
