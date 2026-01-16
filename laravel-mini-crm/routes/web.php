<?php

use App\Http\Controllers\CompaniesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('companies', [CompaniesController::class, 'index'])->name('companies');
    Route::get('companies/create', [CompaniesController::class, 'create'])->name('companies.create');
    Route::post('companies', [CompaniesController::class, 'store'])->name('companies.store');
    Route::get('companies/{company}/edit', [CompaniesController::class, 'edit'])->name('companies.edit');
    Route::put('companies/{company}', [CompaniesController::class, 'update'])->name('companies.update');
    Route::delete('companies/{company}', [CompaniesController::class, 'destroy'])->name('companies.destroy');

    Route::get('employees', function () {
        return Inertia::render('employees');
    })->name('employees');
});

require __DIR__.'/settings.php';
