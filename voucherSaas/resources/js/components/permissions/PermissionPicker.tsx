import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type PermissionPickerProps = {
    allPermissions: string[];
    value: string[];
    onChange: (next: string[]) => void;

    title?: string;
    description?: string;
};

type PermissionGroup = {
    group: string;
    permissions: string[];
};

function groupPermissions(permissions: string[]): PermissionGroup[] {
    const map = new Map<string, string[]>();

    for (const p of permissions) {
        // users.view -> users
        const [group] = p.split(".");
        const groupName = (group ?? "other").toLowerCase();

        if (!map.has(groupName)) {
            map.set(groupName, []);
        }
        map.get(groupName)!.push(p);
    }

    // sort groups + sort permissions inside group
    return Array.from(map.entries())
        .map(([group, perms]) => ({
            group,
            permissions: perms.sort((a, b) => a.localeCompare(b)),
        }))
        .sort((a, b) => a.group.localeCompare(b.group));
}

function titleCase(text: string) {
    return text
        .replace(/_/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PermissionPicker({
    allPermissions,
    value,
    onChange,
    title = "Permissions",
    description = "Assign extra permissions (optional). Keep empty to use role defaults.",
}: PermissionPickerProps) {
    const [query, setQuery] = useState("");

    const groups = useMemo(() => {
        const grouped = groupPermissions(allPermissions);

        if (!query.trim()) return grouped;

        const q = query.trim().toLowerCase();
        return grouped
            .map((g) => ({
                ...g,
                permissions: g.permissions.filter((p) =>
                    p.toLowerCase().includes(q)
                ),
            }))
            .filter((g) => g.permissions.length > 0);
    }, [allPermissions, query]);

    const totalCount = allPermissions.length;
    const selectedCount = value.length;

    const isAllSelected = selectedCount > 0 && selectedCount === totalCount;

    const togglePermission = (perm: string, checked: boolean) => {
        if (checked) {
            if (value.includes(perm)) return;
            onChange([...value, perm]);
        } else {
            onChange(value.filter((x) => x !== perm));
        }
    };

    const toggleAll = () => {
        if (isAllSelected) {
            onChange([]);
            return;
        }
        onChange([...allPermissions]);
    };

    const groupSelectedCount = (permissions: string[]) => {
        return permissions.filter((p) => value.includes(p)).length;
    };

    const toggleGroup = (permissions: string[]) => {
        const selectedInGroup = groupSelectedCount(permissions);
        const allInGroupSelected = selectedInGroup === permissions.length;

        if (allInGroupSelected) {
            // remove all group perms
            onChange(value.filter((p) => !permissions.includes(p)));
        } else {
            // add missing perms
            const next = new Set(value);
            for (const p of permissions) next.add(p);
            onChange([...next]);
        }
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={toggleAll}
                    >
                        {isAllSelected ? "Unselect All" : "Select All"}
                    </Button>

                    <span className="rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        Selected{" "}
                        <span className="font-semibold text-foreground">
                            {selectedCount}
                        </span>{" "}
                        / {totalCount}
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="mt-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search permissions..."
                        className="pl-9 rounded-xl"
                    />
                </div>
            </div>

            {/* Groups */}
            <div className="mt-5 space-y-4">
                {groups.map((g) => {
                    const selectedInGroup = groupSelectedCount(g.permissions);
                    const allInGroupSelected =
                        selectedInGroup === g.permissions.length &&
                        g.permissions.length > 0;

                    return (
                        <div
                            key={g.group}
                            className="rounded-2xl border border-border/60 bg-background p-4"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {titleCase(g.group)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedInGroup} / {g.permissions.length} selected
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => toggleGroup(g.permissions)}
                                >
                                    {allInGroupSelected
                                        ? "Unselect Group"
                                        : "Select Group"}
                                </Button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {g.permissions.map((perm) => {
                                    const checked = value.includes(perm);

                                    return (
                                        <label
                                            key={perm}
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs transition",
                                                checked
                                                    ? "bg-primary/10 border-primary/20"
                                                    : "bg-background hover:bg-muted/40"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) =>
                                                    togglePermission(
                                                        perm,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    checked && "text-primary"
                                                )}
                                            >
                                                {perm}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {groups.length === 0 && (
                    <div className="rounded-2xl border border-border/60 bg-background p-6 text-center text-sm text-muted-foreground">
                        No permissions found for "{query}".
                    </div>
                )}
            </div>
        </div>
    );
}
