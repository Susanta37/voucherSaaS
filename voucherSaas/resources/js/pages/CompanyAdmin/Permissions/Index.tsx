import AppLayout from "@/layouts/app-layout";
import Pagination from "@/components/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { KeyRound, Search } from "lucide-react";
import { useState } from "react";

type PermissionRow = {
    id: number;
    name: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function PermissionsIndex({
    permissions,
    filters,
}: {
    permissions: {
        data: PermissionRow[];
        links: PaginationLink[];
        meta: { from: number | null; to: number | null; total: number };
    };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? "");

    const apply = () => {
        router.get(
            "/admin/permissions",
            { search: search || undefined },
            { preserveScroll: true, preserveState: true }
        );
    };

    const reset = () => {
        setSearch("");
        router.get("/admin/permissions", {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Permissions
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Read-only permission list (system-managed). Assign permissions via Roles.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2 text-xs text-muted-foreground">
                        <KeyRound className="h-4 w-4" />
                        Security Layer
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search permission name..."
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
                                <th className="p-4 font-medium">Permission</th>
                                <th className="p-4 font-medium">Group</th>
                            </tr>
                        </thead>

                        <tbody>
                            {permissions.data.map((p) => {
                                const group = p.name.split(".")[0];

                                return (
                                    <tr
                                        key={p.id}
                                        className="border-t border-border/60 hover:bg-muted/30 transition"
                                    >
                                        <td className="p-4 font-semibold">{p.name}</td>

                                        <td className="p-4">
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
                                                {group}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {permissions.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No permissions found.
                        </div>
                    )}
                </div>

                <Pagination users={permissions} />
            </div>
        </AppLayout>
    );
}
