import AppLayout from "@/layouts/app-layout";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BranchEdit({
    branch,
}: {
    branch: {
        id: number;
        name: string;
        code: string;
        phone?: string | null;
        address?: string | null;
        is_active: boolean;
    };
}) {
    const form = useForm({
        name: branch.name,
        code: branch.code,
        phone: branch.phone ?? "",
        address: branch.address ?? "",
        is_active: branch.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.put(`/admin/branches/${branch.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Edit Branch
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update branch info and manage status.
                        </p>
                    </div>

                    <Link
                        href="/admin/branches"
                        className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-border/60 bg-card p-6 space-y-4"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">
                                Branch Name
                            </label>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                                className="mt-2 rounded-xl"
                            />
                            {form.errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Branch Code
                            </label>
                            <Input
                                value={form.data.code}
                                onChange={(e) =>
                                    form.setData("code", e.target.value)
                                }
                                className="mt-2 rounded-xl"
                            />
                            {form.errors.code && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.errors.code}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData("phone", e.target.value)
                                }
                                className="mt-2 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Address
                            </label>
                            <Input
                                value={form.data.address}
                                onChange={(e) =>
                                    form.setData("address", e.target.value)
                                }
                                className="mt-2 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                        <div>
                            <p className="text-sm font-medium">Branch Status</p>
                            <p className="text-xs text-muted-foreground">
                                Disable if this branch should not login or register vouchers.
                            </p>
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData("is_active", e.target.checked)
                                }
                                className="h-4 w-4"
                            />
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="submit"
                            className="rounded-xl"
                            disabled={form.processing}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {form.processing ? "Saving..." : "Update Branch"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
