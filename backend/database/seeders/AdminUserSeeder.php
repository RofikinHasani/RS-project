<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Creates the default admin login for the /admin panel:
 *   email:    admin@embervine.com
 *   password: admin12345
 *
 * Change this password after your first login in production.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@embervine.com'],
            [
                'name' => 'Restaurant Admin',
                'password' => Hash::make('admin12345'),
                'is_admin' => true,
            ]
        );
    }
}
