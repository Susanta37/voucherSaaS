import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import Pagination from "@/components/pagination";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Search, Pencil, Trash2, Users, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BranchRow = {
    id: number;
    name: string;
    code: string;
    phone?: string | null;
    address?: string | null;
    is_active: boolean;
    users_count?: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function BranchesIndex({
    branches,
    filters,
    kpis,
}: {
    branches: {
        data: BranchRow[];
        links: PaginationLink[];
        meta?: { from: number | null; to: number | null; total: number };
        from?: number | null;
        to?: number | null;
        total?: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    kpis: {
        total: number;
        active: number;
        disabled: number;
    };
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    const applyFilters = () => {
        router.get(
            "/admin/branches",
            {
                search: search || undefined,
                status: status || undefined,
            },
            { preserveScroll: true, preserveState: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        router.get("/admin/branches", {}, { preserveScroll: true });
    };

    const onDelete = (id: number) => {
        if (!confirm("Are you sure you want to delete this branch?")) {
            return;
        }

        router.delete(`/admin/branches/${id}`, {
            preserveScroll: true,
        });
    };

    const toggleBranch = (id: number) => {
        router.patch(`/admin/branches/${id}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Branches
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage all showroom branches with quick status toggle and employee tracking.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/branches/create"
                            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                        >
                            + Create Branch
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard
                        title="Total Branches"
                        value={kpis.total}
                        subtitle="All branches under company"
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Active Branches"
                        value={kpis.active}
                        subtitle="Enabled and operational"
                        icon={<Power className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Disabled Branches"
                        value={kpis.disabled}
                        subtitle="Login & operations blocked"
                        icon={<Power className="h-5 w-5" />}
                    />
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search branch name / code / phone..."
                                className="pl-9 rounded-xl"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none"
                        >
                            <option value="">All status</option>
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                        </select>

                        {/* Buttons */}
                        <div className="flex gap-2 lg:col-span-2">
                            <Button
                                type="button"
                                className="w-full rounded-xl"
                                onClick={applyFilters}
                            >
                                Apply
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-xl"
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 sticky top-0">
                                <tr className="text-left">
                                    <th className="p-4 font-medium">Branch</th>
                                    <th className="p-4 font-medium">Code</th>
                                    <th className="p-4 font-medium">Phone</th>
                                    <th className="p-4 font-medium">Employees</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {branches.data.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-t border-border/60 hover:bg-muted/30 transition"
                                    >
                                        <td className="p-4">
                                            <p className="font-semibold">{b.name}</p>
                                            {b.address ? (
                                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                                    {b.address}
                                                </p>
                                            ) : (
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    No address added
                                                </p>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <span className="rounded-xl border border-border/60 bg-background px-3 py-1 text-xs font-semibold">
                                                {b.code}
                                            </span>
                                        </td>

                                        <td className="p-4 text-muted-foreground">
                                            {b.phone ?? "-"}
                                        </td>

                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                <Users className="h-4 w-4" />
                                                {b.users_count ?? 0}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <StatusBadge active={b.is_active} />
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-end flex-wrap gap-2">
                                                {/* View Employees */}
                                                <Link
                                                    href={`/admin/branches/${b.id}/employees`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                                                >
                                                    <Users className="h-4 w-4" />
                                                    View
                                                </Link>

                                                {/* Toggle Enable/Disable */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleBranch(b.id)}
                                                    className={cn(
                                                        "inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold transition",
                                                        b.is_active
                                                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/15"
                                                            : "bg-red-500/10 text-red-700 hover:bg-red-500/15"
                                                    )}
                                                >
                                                    <Power className="h-4 w-4" />
                                                    {b.is_active ? "Disable" : "Enable"}
                                                </button>

                                                {/* Edit */}
                                                <Link
                                                    href={`/admin/branches/${b.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(b.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {branches.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No branches found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination users={branches} />
            </div>
        </AppLayout>
    );
}

/* ---------------- Small UI Components ---------------- */

function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                active
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
            )}
        >
            {active ? "Active" : "Disabled"}
        </span>
    );
}
