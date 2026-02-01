import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import Pagination from "@/components/pagination";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Users, Power, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function EmployeesIndex({
    employees,
    filters,
    kpis,
}: any) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    const applyFilters = () => {
        router.get(
            "/branch/employees",
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
        router.get("/branch/employees", {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Employees
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Employee activity, login & voucher performance tracking
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard
                        title="Total Employees"
                        value={kpis.total}
                        subtitle="All employees"
                        icon={<Users className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Active Employees"
                        value={kpis.active}
                        subtitle="Can login & generate vouchers"
                        icon={<Power className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Disabled Employees"
                        value={kpis.disabled}
                        subtitle="Login blocked"
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
                                placeholder="Search employee name / email..."
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
                                    <th className="p-4 font-medium">Employee</th>
                                    <th className="p-4 font-medium">Branch</th>
                                    <th className="p-4 font-medium text-center">Vouchers</th>
                                    <th className="p-4 font-medium text-center">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.data.map((e: any) => (
                                    <tr
                                        key={e.id}
                                        className="border-t border-border/60 hover:bg-muted/30 transition"
                                    >
                                        <td className="p-4">
                                            <p className="font-semibold">{e.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {e.email}
                                            </p>
                                        </td>

                                        <td className="p-4">
                                            {e.branch?.name ?? "—"}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                <Ticket className="h-4 w-4" />
                                                {e.vouchers_count}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">
                                            <StatusBadge active={e.is_active} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {employees.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No employees found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination users={employees} />
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
