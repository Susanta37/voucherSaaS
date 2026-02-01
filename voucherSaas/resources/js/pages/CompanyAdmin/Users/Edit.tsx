import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PermissionPicker from "@/components/permissions/PermissionPicker";

type Branch = { id: number; name: string };

type UserPayload = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    whatsapp?: string | null;
    branch_id: number | null;
    role: string;
    is_active: boolean;
    permissions: string[];
};

export default function EditUser({
    user,
    branches,
    roles,
    permissions,
}: {
    user: UserPayload;
    branches: Branch[];
    roles: string[];
    permissions: string[];
}) {
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        whatsapp: user.whatsapp ?? "",
        branch_id: user.branch_id ? String(user.branch_id) : "",
        role: user.role,
        password: "",
        is_active: user.is_active,
        permissions: user.permissions ?? [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form,

            // ✅ FIX: only send branch_id when required
            branch_id:
                form.role === "company_admin"
                    ? null
                    : Number(form.branch_id || null),
        };

        router.put(`/admin/users/${user.id}`, payload, {
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
                            Edit User
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update role, branch, and permissions.
                        </p>
                    </div>
                </div>

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
                                    <option value="">—</option>
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
                                    New Password (optional)
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
                                    placeholder="Leave empty to keep old password"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                is_active: e.target.checked,
                                            })
                                        }
                                    />
                                    Active (allow login)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Permission Picker */}
                    <PermissionPicker
                        allPermissions={permissions}
                        value={form.permissions}
                        onChange={(next) =>
                            setForm({ ...form, permissions: next })
                        }
                        description="Optional overrides. Defaults come from the selected role."
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
                            Update User
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
