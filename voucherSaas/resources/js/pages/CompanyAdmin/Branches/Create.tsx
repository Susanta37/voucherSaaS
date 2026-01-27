import AppLayout from "@/layouts/app-layout";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Building2, Phone, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BranchCreate({ nextCode }: { nextCode: string }) {
    const form = useForm({
        name: "",
        phone: "",
        address: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post("/admin/branches", {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Create Branch
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new branch for better employee tracking and voucher management.
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

                {/* Auto Code Preview */}
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="text-xs text-muted-foreground">
                        Branch Code (Auto Generated)
                    </p>
                    <p className="mt-1 text-sm font-semibold">{nextCode}</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-border/60 bg-card p-6 space-y-6"
                >
                    {/* Branch Name */}
                    <div>
                        <label className="text-sm font-medium">
                            Branch Name <span className="text-red-500">*</span>
                        </label>

                        <div className="relative mt-2">
                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={form.data.name}
                                onChange={(e) => form.setData("name", e.target.value)}
                                placeholder="Example: Premsons Sambalpur"
                                className="pl-9 rounded-xl"
                            />
                        </div>

                        {form.errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium">Phone (Optional)</label>

                        <div className="relative mt-2">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={form.data.phone}
                                onChange={(e) => form.setData("phone", e.target.value)}
                                placeholder="Example: 9876543210"
                                className="pl-9 rounded-xl"
                            />
                        </div>

                        {form.errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-sm font-medium">Address (Optional)</label>

                        <div className="relative mt-2">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={form.data.address}
                                onChange={(e) =>
                                    form.setData("address", e.target.value)
                                }
                                placeholder="Full address of showroom branch"
                                className="pl-9 rounded-xl"
                            />
                        </div>

                        {form.errors.address && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.errors.address}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <Link
                            href="/admin/branches"
                            className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition"
                        >
                            Cancel
                        </Link>

                        <Button
                            type="submit"
                            className="rounded-xl"
                            disabled={form.processing}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? "Saving..." : "Create Branch"}
                        </Button>
                    </div>
                </form>

                {/* Bottom Note */}
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <p className="text-sm font-semibold">Enterprise Note</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Branches help you isolate employees, customers, vouchers and claims branch-wise.
                        This structure is perfect for multi-showroom businesses like Premsons Motor.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
