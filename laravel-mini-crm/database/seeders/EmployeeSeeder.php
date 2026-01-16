<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all companies
        $companies = Company::all();

        foreach ($companies as $company) {
            // Create 2-5 employees per company
            Employee::factory()->count(rand(5, 25))->create([
                'company_id' => $company->id,
            ]);
        }
    }
}
