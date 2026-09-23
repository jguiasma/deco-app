<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrNew([
            'email' => env('ADMIN_EMAIL'),
        ]);

        $admin->name = env('ADMIN_NAME');
        $admin->password = Hash::make(env('ADMIN_PASSWORD'));
        $admin->is_admin = true;
        $admin->save();
    }
}