import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import { 
    Users, Building2, UserCheck, UserX, 
    QrCode, Ticket, ShieldCheck, ArrowRight,
    MousePointer2, PlusCircle, ScanLine
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function CompanyAdminDashboard({
    kpis,
    usersByRole,
    usersByBranch,
    recentUsers,
}: any) {
    return (
        <AppLayout>
            <div className="space-y-8 p-4 sm:p-8 ">
                {/* Header with Greeting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Enterprise Overview</h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor infrastructure, users, and PPC performance across all branches.
                        </p>
                    </div>
                    
                    {/* Floating Quick Action */}
                    <Link href="/branch/vouchers/scanner">
                        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 hover:scale-105 transition-transform">
                            <ScanLine size={18} />
                            Launch Scanner
                        </Button>
                    </Link>
                </div>

                {/* Primary KPI Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        title="Network Branches"
                        value={kpis.branches.total}
                        subtitle={`${kpis.branches.active} active locations`}
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Workforce Size"
                        value={kpis.users.total}
                        subtitle={`${kpis.users.active} active accounts`}
                        icon={<Users className="h-5 w-5" />}
                    />
                    <KpiCard
                        title="Total PPC Issued"
                        value={kpis.ppc.total_vouchers}
                        subtitle="Vouchers generated"
                        icon={<Ticket className="h-5 w-5 text-blue-500" />}
                    />
                    <KpiCard
                        title="Successful Claims"
                        value={kpis.ppc.total_claims}
                        subtitle="Customer redemptions"
                        icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
                    />
                </div>

                {/* PPC Command Center (New Section) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickLinkCard 
                        title="Voucher Manager" 
                        desc="Generate and track privilege codes" 
                        href="/branch/vouchers" 
                        icon={<Ticket className="text-blue-500" />}
                        color="bg-blue-500/10"
                    />
                    <QuickLinkCard 
                        title="Real-time Scanner" 
                        desc="Verify customer codes instantly" 
                        href="/branch/vouchers/scanner" 
                        icon={<QrCode className="text-primary" />}
                        color="bg-primary/10"
                    />
                    <QuickLinkCard 
                        title="Claim Analytics" 
                        desc="View detailed customer logs" 
                        href="/branch/vouchers/claims" 
                        icon={<MousePointer2 className="text-emerald-500" />}
                        color="bg-emerald-500/10"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* User Distribution - Roles */}
                    <CardWrapper title="Users by Role">
                        <div className="space-y-4">
                            {usersByRole.map((r: any) => (
                                <div key={r.role} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="capitalize text-sm font-medium">{r.role.replace("_", " ")}</span>
                                    </div>
                                    <span className="font-bold tabular-nums">{r.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardWrapper>

                    {/* User Distribution - Branches */}
                    <CardWrapper title="Top Branches">
                        <div className="space-y-4">
                            {usersByBranch.map((b: any) => (
                                <div key={b.id} className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate max-w-[150px]">{b.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${(b.users_count / kpis.users.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">{b.users_count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardWrapper>

                    {/* Quick Access to System Config */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">System Admin</h3>
                        <div className="grid gap-3">
                            <AdminActionLink href="/admin/branches" label="Manage Branches" icon={<Building2 size={16}/>} />
                            <AdminActionLink href="/admin/users" label="Personnel Directory" icon={<Users size={16}/>} />
                            <AdminActionLink href="/branch/templates" label="Privilege Templates" icon={<PlusCircle size={16}/>} />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="rounded-[2rem] border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between p-6">
                        <h3 className="font-bold">Recently Onboarded Users</h3>
                        <Link href="/admin/users" className="text-xs font-bold flex items-center gap-1 text-primary">
                            Full Directory <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold text-muted-foreground">Name</th>
                                    <th className="px-6 py-3 text-left font-bold text-muted-foreground">Branch</th>
                                    <th className="px-6 py-3 text-left font-bold text-muted-foreground">Access Level</th>
                                    <th className="px-6 py-3 text-right font-bold text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {recentUsers.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-semibold">{u.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{u.branch?.name ?? "HQ"}</td>
                                        <td className="px-6 py-4 capitalize">
                                            <Badge variant="outline" className="font-medium">
                                                {u.roles?.[0]?.name?.replace("_", " ") ?? "Employee"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                u.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                                            }`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {u.is_active ? "Active" : "Locked"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Support Components for cleaner code
function CardWrapper({ title, children }: any) {
    return (
        <div className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 mb-6 italic">{title}</h3>
            {children}
        </div>
    );
}

function QuickLinkCard({ title, desc, href, icon, color }: any) {
    return (
        <Link href={href} className="group">
            <div className="h-full p-5 rounded-[2rem] border border-border/60 bg-card hover:border-primary/50 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
        </Link>
    );
}

function AdminActionLink({ href, label, icon }: any) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-border hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-3">
                <div className="text-muted-foreground">{icon}</div>
                <span className="text-sm font-semibold">{label}</span>
            </div>
            <ArrowRight size={14} className="text-muted-foreground" />
        </Link>
    );
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-tighter ${className}`}>
            {children}
        </span>
    );
}