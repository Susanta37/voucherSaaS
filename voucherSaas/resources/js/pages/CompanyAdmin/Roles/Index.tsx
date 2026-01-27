import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, router } from "@inertiajs/react";
import { Shield, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type RoleRow = {
    id: number;
    name: string;
    users_count: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function RolesIndex({
    roles,
    filters,
    kpis,
}: {
    roles: {
        data: RoleRow[];
        links: PaginationLink[];
        meta: { from: number | null; to: number | null; total: number };
    };
    filters: { search?: string };
    kpis: { total: number };
}) {
    const [search, setSearch] = useState(filters.search ?? "");

    const apply = () => {
        router.get(
            "/admin/roles",
            { search: search || undefined },
            { preserveScroll: true, preserveState: true }
        );
    };

    const reset = () => {
        setSearch("");
        router.get("/admin/roles", {}, { preserveScroll: true });
    };

    const destroy = (id: number) => {
        if (!confirm("Delete this role?")) return;
        router.delete(`/admin/roles/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Roles
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create roles and assign permissions like enterprise dashboards.
                        </p>
                    </div>

                    <Link
                        href="/admin/roles/create"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                        + Create Role
                    </Link>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard
                        title="Total Roles"
                        value={kpis.total}
                        subtitle="Available roles"
                        icon={<Shield className="h-5 w-5" />}
                    />
                </div>

                {/* Filter */}
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search role name..."
                                className="pl-9 rounded-xl"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button className="w-full rounded-xl" onClick={apply}>
                                Apply
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full rounded-xl"
                                onClick={reset}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                            <tr className="text-left">
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Users</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {roles.data.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-t border-border/60 hover:bg-muted/30 transition"
                                >
                                    <td className="p-4 font-semibold capitalize">
                                        {r.name.replaceAll("_", " ")}
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {r.users_count}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/roles/${r.id}/edit`}
                                                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => destroy(r.id)}
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

                    {roles.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No roles found.
                        </div>
                    )}
                </div>

                <Pagination users={roles} />
            </div>
        </AppLayout>
    );
}
