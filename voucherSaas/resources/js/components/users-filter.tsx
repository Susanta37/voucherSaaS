import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Branch = { id: number; name: string };

export default function UsersFilter({
    branches,
    defaultValues,
}: {
    branches: Branch[];
    defaultValues: {
        search?: string;
        role?: string;
        status?: string;
        branch_id?: number | string | null;
    };
}) {
    const [search, setSearch] = useState(defaultValues.search ?? "");
    const [role, setRole] = useState(defaultValues.role ?? "");
    const [status, setStatus] = useState(defaultValues.status ?? "");
    const [branchId, setBranchId] = useState(defaultValues.branch_id ?? "");

    const roles = useMemo(
        () => [
            { value: "", label: "All roles" },
            { value: "branch_admin", label: "Branch Admin" },
            { value: "employee", label: "Employee" },
        ],
        []
    );

    const applyFilters = () => {
        router.get(
            "/admin/users",
            {
                search: search || undefined,
                role: role || undefined,
                status: status || undefined,
                branch_id: branchId || undefined,
            },
            { preserveScroll: true, preserveState: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setRole("");
        setStatus("");
        setBranchId("");
        router.get("/admin/users", {}, { preserveScroll: true });
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name / email..."
                        className="pl-9 rounded-xl"
                    />
                </div>

                {/* Role */}
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none"
                >
                    {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>

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

                {/* Branch */}
                <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none"
                >
                    <option value="">All branches</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>

                {/* Buttons */}
                <div className="flex gap-2">
                    <Button className="w-full rounded-xl" onClick={applyFilters}>
                        Apply
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full rounded-xl"
                        onClick={resetFilters}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
