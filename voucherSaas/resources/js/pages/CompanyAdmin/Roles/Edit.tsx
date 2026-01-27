import AppLayout from "@/layouts/app-layout";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

function groupPermissions(perms: string[]) {
    const grouped: Record<string, string[]> = {};

    perms.forEach((p) => {
        const [group] = p.split(".");
        const key = group ?? "other";

        grouped[key] = grouped[key] || [];
        grouped[key].push(p);
    });

    return grouped;
}

export default function RoleEdit({
    role,
    permissions,
}: {
    role: {
        id: number;
        name: string;
        permissions: string[];
    };
    permissions: string[];
}) {
    const grouped = groupPermissions(permissions);

    const form = useForm({
        name: role.name ?? "",
        permissions: role.permissions ?? [],
    });

    const togglePermission = (perm: string) => {
        form.setData(
            "permissions",
            form.data.permissions.includes(perm)
                ? form.data.permissions.filter((p) => p !== perm)
                : [...form.data.permissions, perm]
        );
    };

    const toggleGroup = (groupKey: string) => {
        const groupPerms = grouped[groupKey];
        const hasAll = groupPerms.every((p) => form.data.permissions.includes(p));

        if (hasAll) {
            form.setData(
                "permissions",
                form.data.permissions.filter((p) => !groupPerms.includes(p))
            );
        } else {
            form.setData(
                "permissions",
                Array.from(new Set([...form.data.permissions, ...groupPerms]))
            );
        }
    };

    const submit = () => {
        form.put(`/admin/roles/${role.id}`);
    };

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Edit Role
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update role name and permissions safely.
                        </p>
                    </div>

                    <Link
                        href="/admin/roles"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-6">
                    {/* Role Name */}
                    <div>
                        <label className="text-sm font-medium">Role Name</label>
                        <Input
                            value={form.data.name}
                            onChange={(e) => form.setData("name", e.target.value)}
                            placeholder="ex: branch_admin"
                            className="mt-2 rounded-xl"
                        />
                        {form.errors.name && (
                            <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>
                        )}
                    </div>

                    {/* Permissions */}
                    <div>
                        <p className="text-sm font-medium">Permissions</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Select grouped permissions like an enterprise admin panel.
                        </p>

                        <div className="mt-4 space-y-4">
                            {Object.keys(grouped).map((groupKey) => {
                                const items = grouped[groupKey];

                                const allChecked = items.every((p) =>
                                    form.data.permissions.includes(p)
                                );

                                return (
                                    <div
                                        key={groupKey}
                                        className="rounded-2xl border border-border/60 bg-background p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold capitalize">
                                                {groupKey.replaceAll("_", " ")}
                                            </p>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-xl text-xs"
                                                onClick={() => toggleGroup(groupKey)}
                                            >
                                                {allChecked ? "Unselect All" : "Select All"}
                                            </Button>
                                        </div>

                                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {items.map((perm) => {
                                                const checked =
                                                    form.data.permissions.includes(perm);

                                                return (
                                                    <label
                                                        key={perm}
                                                        className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs hover:bg-muted/30 transition cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => togglePermission(perm)}
                                                        />
                                                        <span className="font-medium">{perm}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => form.reset()}
                        >
                            Reset
                        </Button>

                        <Button
                            type="button"
                            className="rounded-xl"
                            onClick={submit}
                            disabled={form.processing}
                        >
                            {form.processing ? "Updating..." : "Update Role"}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
