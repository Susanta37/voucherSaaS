import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BranchesFilter({
    defaultValues,
}: {
    defaultValues: {
        search?: string;
        status?: string;
    };
}) {
    const [search, setSearch] = useState(defaultValues.search ?? "");
    const [status, setStatus] = useState(defaultValues.status ?? "");

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

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name / code / phone..."
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
                <Button className="rounded-xl" onClick={applyFilters}>
                    Apply
                </Button>

                <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={resetFilters}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
