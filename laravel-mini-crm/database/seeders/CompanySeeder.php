<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define sample companies with their logo files
        $companies = [
            [
                'name' => 'AICorp Solutions',
                'email' => 'info@aicorp.com',
                'website' => 'https://aicorp.com',
                'logo_file' => 'aiapp-logo.png', // This file should exist in database/seeders/logos/
            ],
            [
                'name' => 'A Industries',
                'email' => 'contact@aindustries.com',
                'website' => 'https://aindustries.com',
                'logo_file' => 'a-logo.jpg',
            ],
            [
                'name' => 'Bird Labs',
                'email' => 'hello@birdlabs.com',
                'website' => 'https://birdlabs.com',
                'logo_file' => 'bird_app_logo.jpg',
            ],
        ];

        foreach ($companies as $companyData) {
            $logoFile = $companyData['logo_file'];
            unset($companyData['logo_file']);

            // Copy logo from seed directory to storage
            $logoPath = $this->copyLogoToStorage($logoFile);

            // Create company with logo path
            $companyData['logo'] = $logoPath;

            Company::create($companyData);

        }
    }

    /**
     * Copy logo file from seed directory to storage/app/public/company-logos/
     *
     * @param string $filename
     * @return string|null
     */
    private function copyLogoToStorage(string $filename): ?string
    {
        $seedLogosPath = database_path('seeders/logos/' . $filename);
        $storagePath = 'company-logos/' . $filename;

        // Check if seed logo exists
        if (!File::exists($seedLogosPath)) {
            $this->command->warn("Logo file not found: {$seedLogosPath}");
            return null;
        }

        // Ensure the company-logos directory exists in storage
        Storage::disk('public')->makeDirectory('company-logos');

        // Copy the file to storage/app/public/company-logos/
        $copied = Storage::disk('public')->put($storagePath, File::get($seedLogosPath));

        if ($copied) {
            $this->command->info("Copied logo: {$filename}");
            return $storagePath;
        }

        $this->command->error("Failed to copy logo: {$filename}");
        return null;
    }
    
}
