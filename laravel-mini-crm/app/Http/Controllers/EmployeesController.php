<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class EmployeesController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('company');

        // Filter by company if company_id is provided
        if ($request->has('company_id') && $request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        $employees = $query->paginate(10);

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'company' => $request->company_id ? Company::find($request->company_id) : null,
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $companies = Company::all();

        return Inertia::render('employees/create', [
            'companies' => $companies,
            'selectedCompanyId' => $request->query('company_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        Employee::create($validated);

        // If we came from a filtered view, redirect back to it
        if ($validated['company_id']) {
            return redirect()->route('employees.index', ['company_id' => $validated['company_id']])
                           ->with('message', 'Employee created successfully!');
        }

        return redirect()->route('employees.index')->with('message', 'Employee created successfully!');
    }

    public function edit(Employee $employee)
    {
        $companies = Company::all();

        return Inertia::render('employees/edit', [
            'employee' => $employee,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        // Ensure company_id is an integer
        $validated['company_id'] = (int) $validated['company_id'];

        $employee->update($validated);

        // If we came from a filtered view, redirect back to it
        return Inertia::location(route('employees.index', ['company_id' => $validated['company_id']]));
    }

    public function destroy(Employee $employee)
    {
        $companyId = $employee->company_id;
        $employee->delete();

        // Redirect to the company's employee list
        return redirect()->route('employees.index', ['company_id' => $companyId])
                        ->with('message', 'Employee deleted successfully!');
    }
}