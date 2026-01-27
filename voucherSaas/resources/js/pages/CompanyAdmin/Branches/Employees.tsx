import AppLayout from "@/layouts/app-layout";
import Pagination from "@/components/pagination";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function BranchEmployees({
    branch,
    users,
}: any) {
    return (
        <AppLayout>
            <div className="space-y-6 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Employees - {branch.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Branch Code: {branch.code}
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

                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40">
                                <tr className="text-left">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Role</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.map((u: any) => (
                                    <tr
                                        key={u.id}
                                        className="border-t border-border/60 hover:bg-muted/30 transition"
                                    >
                                        <td className="p-4 font-medium">{u.name}</td>
                                        <td className="p-4 text-muted-foreground">{u.email}</td>
                                        <td className="p-4 capitalize">
                                            {u.roles?.[0]?.name?.replace("_", " ") ?? "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">
                            No employees found in this branch.
                        </div>
                    )}
                </div>

                <Pagination users={users} />
            </div>
        </AppLayout>
    );
}
