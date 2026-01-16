import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Eye, Edit, Trash2, Plus } from 'lucide-react';
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
import { companies } from '@/routes';
import { type BreadcrumbItem } from '@/types';

interface Company {
    id: number;
    name: string;
    email: string | null;
    website: string | null;
    logo: string | null;
    created_at: string;
}

interface CompaniesProps {
    companies: {
        data: Company[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    flash?: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companies().url,
    },
];

export default function Companies({ companies, flash }: CompaniesProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const { delete: destroy, processing } = useForm();

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (companyToDelete) {
            destroy(`/companies/${companyToDelete.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setCompanyToDelete(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Building2 className="h-8 w-8" />
                        <div>
                            <h1 className="text-2xl font-bold">Companies</h1>
                            <p className="text-muted-foreground">
                                {companies.total} companies total
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/companies/create">
                            <Plus className="h-4 w-4" />
                            Add Company
                        </Link>
                    </Button>
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
                                        Company
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Contact
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Website
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.data.map((company) => (
                                    <tr key={company.id} className="border-b border-sidebar-border/70 hover:bg-muted/30">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                {company.logo ? (
                                                    <img
                                                        src={`/storage/${company.logo}`}
                                                        alt={`${company.name} logo`}
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">{company.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID: {company.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="space-y-1">
                                                {company.email && (
                                                    <div className="text-sm">{company.email}</div>
                                                )}
                                                {!company.email && (
                                                    <div className="text-sm text-muted-foreground">No email</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {company.website ? (
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {company.website}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No website</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    title="View employees"
                                                >
                                                    <Link href={`/employees?company_id=${company.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    title="Edit company"
                                                >
                                                    <Link href={`/companies/${company.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    title="Delete company"
                                                    onClick={() => handleDeleteClick(company)}
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

                    {companies.data.length === 0 && (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No companies found</h3>
                                <p className="text-muted-foreground">
                                    Get started by adding your first company.
                                </p>
                            </div>
                        </div>
                    )}
                </div>


                {companies.total > companies.per_page && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {companies.from} to {companies.to} of {companies.total} companies
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            {companies.prev_page_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`${companies.prev_page_url}`} preserveScroll>
                                        Previous
                                    </Link>
                                </Button>
                            )}

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const pages = [];
                                    const totalPages = companies.last_page;
                                    const currentPage = companies.current_page;

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
                                                    <Link href="?page=1" preserveScroll>
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
                                                    <Link href={`?page=${page}`} preserveScroll>
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
                                                    <Link href={`?page=${totalPages}`} preserveScroll>
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
                            {companies.next_page_url && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`${companies.next_page_url}`} preserveScroll>
                                        Next
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Company</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{companyToDelete?.name}"? This action cannot be undone.
                            <br />
                            <strong>This will also delete all employees associated with this company.</strong>
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
                            {processing ? 'Deleting...' : 'Delete Company'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}