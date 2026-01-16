import { Head, useForm } from '@inertiajs/react';
import { Building2, Upload } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { companies } from '@/routes';
import { type BreadcrumbItem } from '@/types';

interface Company {
    id: number;
    name: string;
    email: string | null;
    website: string | null;
    logo: string | null;
}

interface EditCompanyProps {
    company: Company;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: companies().url,
    },
    {
        title: 'Edit Company',
        href: '/companies/{id}/edit',
    },
];

export default function EditCompany({ company }: EditCompanyProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name,
        email: company.email || '',
        website: company.website || '',
        logo: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/companies/${company.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${company.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Building2 className="h-8 w-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Edit Company</h1>
                        <p className="text-muted-foreground">
                            Update company information
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        {errors.error && (
                            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                                {errors.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter company name"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="company@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://company.com"
                            />
                            <InputError message={errors.website} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo</Label>
                            <div className="flex items-center gap-4">
                                {company.logo && (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`/storage/${company.logo}`}
                                            alt="Current logo"
                                            className="h-10 w-10 rounded-lg object-cover"
                                        />
                                        <span className="text-sm text-muted-foreground">Current logo</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('logo', e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="logo"
                                        className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Change Logo
                                    </Label>
                                    {data.logo && (
                                        <span className="text-sm text-muted-foreground">
                                            New: {data.logo.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload a new logo to replace the current one (JPEG, PNG, GIF, SVG - max 2MB)
                            </p>
                            <InputError message={errors.logo} />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Company'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <a href="/companies">Cancel</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}