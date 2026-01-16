import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Edit, Trash2, Plus, Users } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
// import { employees } from '@/routes'; // Temporarily disabled
import { type BreadcrumbItem } from '@/types';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    company: {
        id: number;
        name: string;
    };
}

interface EmployeesProps {
    employees: {
        data: Employee[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    company?: {
        id: number;
        name: string;
    } | null;
    flash?: {
        message?: string;
    };
}

export default function EmployeesIndex({ employees: employeesData, company, flash }: EmployeesProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Employees',
            href: '/employees',
        },
        ...(company ? [{
            title: company.name,
            href: `/employees?company_id=${company.id}`,
        }] : []),
    ];
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const { delete: destroy, processing } = useForm();

    // Helper function to build query string with company_id if filtering
    const buildQueryString = (page?: number) => {
        const params = new URLSearchParams();
        if (page && page > 1) params.set('page', page.toString());
        if (company) params.set('company_id', company.id.toString());
        const query = params.toString();
        return query ? `?${query}` : '';
    };

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (employeeToDelete) {
            destroy(`/employees/${employeeToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setEmployeeToDelete(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company ? `${company.name} Employees` : "Employees"} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Users className="h-8 w-8" />
                        <div>
                            <h1 className="text-2xl font-bold">
                                {company ? `${company.name} Employees` : "Employees"}
                            </h1>
                            <p className="text-muted-foreground">
                                {employeesData.total} employees{company ? ` for ${company.name}` : " total"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {company && (
                            <Button variant="outline" asChild>
                                <Link href="/employees">
                                    View All Employees
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={company ? `/employees/create?company_id=${company.id}` : "/employees/create"}>
                                <Plus className="h-4 w-4" />
                                Add Employee
                            </Link>
                        </Button>
                    </div>
                </div>

                {flash?.message && (
                    <div className="rounded-md bg-green-50 border border-green-200 p-4">
                        <div className="text-sm text-green-800">
                            {flash.message}
                        </div>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                <tr>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Employee
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Company
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Contact
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeesData.data.map((employee) => (
                                    <tr key={employee.id} className="border-b border-sidebar-border/70 hover:bg-muted/30">
                                        <td className="p-4 align-middle">
                                            <div>
                                                <div className="font-medium">
                                                    {employee.first_name} {employee.last_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {employee.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span>{employee.company.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="space-y-1">
                                                {employee.email && (
                                                    <div className="text-sm">{employee.email}</div>
                                                )}
                                                {employee.phone && (
                                                    <div className="text-sm text-muted-foreground">{employee.phone}</div>
                                                )}
                                                {!employee.email && !employee.phone && (
                                                    <div className="text-sm text-muted-foreground">No contact info</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    title="Edit employee"
                                                >
                                                    <Link href={`/employees/${employee.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    title="Delete employee"
                                                    onClick={() => handleDeleteClick(employee)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {employeesData.data.length === 0 && (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
                                <p className="text-muted-foreground">
                                    Get started by adding your first employee.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {employeesData.total > employeesData.per_page && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {employeesData.from} to {employeesData.to} of {employeesData.total} employees
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            {employeesData.prev_page_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`${employeesData.prev_page_url}`} preserveScroll>
                                        Previous
                                    </Link>
                                </Button>
                            )}

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const pages = [];
                                    const totalPages = employeesData.last_page;
                                    const currentPage = employeesData.current_page;

                                    // Always show first page
                                    if (totalPages > 1) {
                                        pages.push(
                                            <Button
                                                key={1}
                                                variant={currentPage === 1 ? "default" : "outline"}
                                                size="sm"
                                                asChild={currentPage !== 1}
                                                disabled={currentPage === 1}
                                            >
                                                {currentPage === 1 ? (
                                                    1
                                                ) : (
                                                    <Link href={buildQueryString(1)} preserveScroll>
                                                        1
                                                    </Link>
                                                )}
                                            </Button>
                                        );
                                    }

                                    // Show ellipsis if needed
                                    if (currentPage > 4) {
                                        pages.push(<span key="start-ellipsis" className="px-2 text-muted-foreground">...</span>);
                                    }

                                    // Show pages around current page
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(totalPages - 1, currentPage + 1);

                                    for (let page = start; page <= end; page++) {
                                        if (page === 1 || page === totalPages) continue; // Skip first and last as they're handled separately

                                        pages.push(
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                asChild={currentPage !== page}
                                                disabled={currentPage === page}
                                            >
                                                {currentPage === page ? (
                                                    page
                                                ) : (
                                                    <Link href={buildQueryString(page)} preserveScroll>
                                                        {page}
                                                    </Link>
                                                )}
                                            </Button>
                                        );
                                    }

                                    // Show ellipsis if needed
                                    if (currentPage < totalPages - 3) {
                                        pages.push(<span key="end-ellipsis" className="px-2 text-muted-foreground">...</span>);
                                    }

                                    // Always show last page
                                    if (totalPages > 1) {
                                        pages.push(
                                            <Button
                                                key={totalPages}
                                                variant={currentPage === totalPages ? "default" : "outline"}
                                                size="sm"
                                                asChild={currentPage !== totalPages}
                                                disabled={currentPage === totalPages}
                                            >
                                                {currentPage === totalPages ? (
                                                    totalPages
                                                ) : (
                                                    <Link href={buildQueryString(totalPages)} preserveScroll>
                                                        {totalPages}
                                                    </Link>
                                                )}
                                            </Button>
                                        );
                                    }

                                    return pages;
                                })()}
                            </div>

                            {/* Next Button */}
                            {employeesData.next_page_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`${employeesData.next_page_url}`} preserveScroll>
                                        Next
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Employee</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{employeeToDelete?.first_name} {employeeToDelete?.last_name}"?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={handleDeleteCancel}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={processing}
                            >
                                {processing ? 'Deleting...' : 'Delete Employee'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}