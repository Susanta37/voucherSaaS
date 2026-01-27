import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PermissionPicker from "@/components/permissions/PermissionPicker";

type Branch = { id: number; name: string };

export default function CreateUser({
    branches,
    roles,
    permissions,
}: {
    branches: Branch[];
    roles: string[];
    permissions: string[];
}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        branch_id: "",
        role: "employee",
        password: "",
        permissions: [] as string[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post("/admin/users", form, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Create User
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add branch admins and employees with correct permissions.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Full Name
                                </p>
                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="mt-2 rounded-xl"
                                    placeholder="Employee name"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Email
                                </p>
                                <Input
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    className="mt-2 rounded-xl"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Phone
                                </p>
                                <Input
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                    className="mt-2 rounded-xl"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    WhatsApp
                                </p>
                                <Input
                                    value={form.whatsapp}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            whatsapp: e.target.value,
                                        })
                                    }
                                    className="mt-2 rounded-xl"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Branch
                                </p>
                                <select
                                    value={form.branch_id}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            branch_id: e.target.value,
                                        })
                                    }
                                    className="mt-2 h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none"
                                >
                                    <option value="">Select branch</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Role
                                </p>
                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({ ...form, role: e.target.value })
                                    }
                                    className="mt-2 h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none"
                                >
                                    {roles.map((r) => (
                                        <option key={r} value={r}>
                                            {r.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Password
                                </p>
                                <Input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className="mt-2 rounded-xl"
                                    placeholder="Minimum 8 characters"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ✅ Permission Picker */}
                    <PermissionPicker
                        allPermissions={permissions}
                        value={form.permissions}
                        onChange={(next) =>
                            setForm({ ...form, permissions: next })
                        }
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => router.visit("/admin/users")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-xl">
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
