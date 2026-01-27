import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import { Users, Building2, UserCheck, UserX } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function CompanyAdminDashboard({
    kpis,
    usersByRole,
    usersByBranch,
    recentUsers,
}: any) {
    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Company Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of branches, users, and activity
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        title="Total Branches"
                        value={kpis.branches.total}
                        subtitle="Across company"
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Active Branches"
                        value={kpis.branches.active}
                        subtitle="Currently operating"
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Active Users"
                        value={kpis.users.active}
                        subtitle="Can login"
                        icon={<UserCheck className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Disabled Users"
                        value={kpis.users.disabled}
                        subtitle="Access blocked"
                        icon={<UserX className="h-5 w-5" />}
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Users by Role */}
                    <div className="rounded-2xl border border-border/60 bg-card p-5">
                        <h3 className="text-sm font-semibold mb-4">
                            Users by Role
                        </h3>

                        <div className="space-y-3">
                            {usersByRole.map((r: any) => (
                                <div
                                    key={r.role}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="capitalize">
                                        {r.role.replace("_", " ")}
                                    </span>
                                    <span className="font-semibold">
                                        {r.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Users by Branch */}
                    <div className="rounded-2xl border border-border/60 bg-card p-5">
                        <h3 className="text-sm font-semibold mb-4">
                            Users by Branch
                        </h3>

                        <div className="space-y-3">
                            {usersByBranch.map((b: any) => (
                                <div
                                    key={b.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{b.name}</span>
                                    <span className="font-semibold">
                                        {b.users_count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="rounded-2xl border border-border/60 bg-card">
                    <div className="flex items-center justify-between p-5">
                        <h3 className="text-sm font-semibold">
                            Recently Added Users
                        </h3>

                        <Link
                            href="/admin/users"
                            className="text-xs text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Branch</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentUsers.map((u: any) => (
                                <tr
                                    key={u.id}
                                    className="border-t border-border/60"
                                >
                                    <td className="p-3 font-medium">
                                        {u.name}
                                    </td>
                                    <td className="p-3">
                                        {u.branch?.name ?? "-"}
                                    </td>
                                    <td className="p-3 capitalize">
                                        {u.roles?.[0]?.name?.replace("_", " ") ??
                                            "-"}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                u.is_active
                                                    ? "bg-green-500/10 text-green-600"
                                                    : "bg-red-500/10 text-red-600"
                                            }`}
                                        >
                                            {u.is_active ? "Active" : "Disabled"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/branches"
                        className="rounded-xl border border-border/60 bg-card px-4 py-2 text-sm font-semibold hover:bg-muted transition"
                    >
                        Manage Branches
                    </Link>

                    <Link
                        href="/admin/users"
                        className="rounded-xl border border-border/60 bg-card px-4 py-2 text-sm font-semibold hover:bg-muted transition"
                    >
                        Manage Users
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
