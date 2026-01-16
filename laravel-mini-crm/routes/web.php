<?php

use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\EmployeesController;
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

    Route::get('employees', [EmployeesController::class, 'index'])->name('employees.index');
    Route::get('employees/create', [EmployeesController::class, 'create'])->name('employees.create');
    Route::post('employees', [EmployeesController::class, 'store'])->name('employees.store');
    Route::get('employees/{employee}/edit', [EmployeesController::class, 'edit'])->name('employees.edit');
    Route::put('employees/{employee}', [EmployeesController::class, 'update'])->name('employees.update');
    Route::delete('employees/{employee}', [EmployeesController::class, 'destroy'])->name('employees.destroy');
});

require __DIR__.'/settings.php';
