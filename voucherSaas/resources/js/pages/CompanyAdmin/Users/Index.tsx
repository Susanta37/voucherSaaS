import AppLayout from "@/layouts/app-layout";
import { Link, router } from "@inertiajs/react";
import { Pencil, Trash2, UserCheck, UserX, Users } from "lucide-react";
// Define PageProps type locally since it's not exported from "@/types"
type PageProps<T> = {
    auth?: any;
    errors?: Record<string, any>;
} & T;
import { cn } from "@/lib/utils";

import KpiCard from "@/components/kpi-card";
import UsersFilter from "@/components/users-filter";
import Pagination from "@/components/pagination";

type Branch = { id: number; name: string };

type UserRow = {
    id: number;
    name: string;
    email: string;
    branch?: { id: number; name: string } | null;
    roles?: { name: string }[];
    is_active: boolean;
};

export default function UsersIndex({
    users,
    filters,
    branches,
    kpis,
}: PageProps<{
    users: any; // paginator object
    filters: {
        search?: string;
        role?: string;
        status?: string;
        branch_id?: number | null;
    };
    branches: Branch[];
    kpis: {
        total: number;
        active: number;
        disabled: number;
    };
}>) {
    const onDelete = (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage branch admins & employees with role-based access.
                        </p>
                    </div>

                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                        + Create User
                    </Link>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard
                        title="Total Users"
                        value={kpis.total}
                        subtitle="All users in company"
                        icon={<Users className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Active Users"
                        value={kpis.active}
                        subtitle="Can login & work"
                        icon={<UserCheck className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Disabled Users"
                        value={kpis.disabled}
                        subtitle="Access blocked"
                        icon={<UserX className="h-5 w-5" />}
                    />
                </div>

                {/* Filters */}
                <UsersFilter branches={branches} defaultValues={filters} />

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 sticky top-0">
                                <tr className="text-left">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Branch</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.map((u: UserRow) => (
                                    <tr
                                        key={u.id}
                                        className="border-t border-border/60 hover:bg-muted/30 transition"
                                    >
                                        <td className="p-4 font-medium">
                                            {u.name}
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {u.email}
                                        </td>
                                        <td className="p-4">
                                            {u.branch?.name ?? "-"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {u.roles?.map((r) => (
                                                    <span
                                                        key={r.name}
                                                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize"
                                                    >
                                                        {r.name.replaceAll("_", " ")}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <StatusBadge active={u.is_active} />
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${u.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => onDelete(u.id)}
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

                    {users.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination users={users} />
            </div>
        </AppLayout>
    );
}

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
