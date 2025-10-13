<?php

namespace Database\Seeders;

use App\Models\Enquiry;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * CODE STRUCTURE SUMMARY:
 * SampleDataSeeder
 * This seeder is responsible for creating sample data for the application
 */
class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get existing permission groups and permissions (created by PermissionSeeder)
        $rootRole = Role::where('name', 'RootUser')->first();
        $adminRole = Role::where('name', 'Admin')->first();
        $userRole = Role::where('name', 'User')->first();

        // 2. Create sample users and assign roles
        $users = [
            [
                'first_name' => 'Alice',
                'last_name' => 'Root',
                'email' => 'alice.root@example.com',
                'mobile' => '9000000001',
                'password' => Hash::make('password'),
                'status' => 'ACTIVE',
            ],
            [
                'first_name' => 'Bob',
                'last_name' => 'Admin',
                'email' => 'bob.admin@example.com',
                'mobile' => '9000000002',
                'password' => Hash::make('password'),
                'status' => 'ACTIVE',
            ],
            [
                'first_name' => 'Charlie',
                'last_name' => 'User',
                'email' => 'charlie.user@example.com',
                'mobile' => '9000000003',
                'password' => Hash::make('password'),
                'status' => 'ACTIVE',
            ],
        ];
        $userModels = [];
        $roleNames = ['RootUser', 'Admin', 'User'];

        foreach ($users as $i => $userData) {
            $user = User::create($userData);
            $user->assignRole($roleNames[$i]);
            $userModels[] = $user;
        }

        // 3. Create sample enquiries
        $enquiries = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'mobile' => '9000000010',
                'message' => 'How do I reset my password?',
                'remark' => 'General enquiry',
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@example.com',
                'mobile' => '9000000011',
                'message' => 'Can I get access to the dashboard?',
                'remark' => 'Access request',
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike.johnson@example.com',
                'mobile' => '9000000012',
                'message' => 'I need help with my account settings.',
                'remark' => 'Technical support',
            ],
        ];
        foreach ($enquiries as $enqData) {
            Enquiry::create($enqData);
        }
    }
}
