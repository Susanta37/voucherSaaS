import React from 'react';
import AppLayout from "@/layouts/app-layout";
import KpiCard from "@/components/kpi-card";
import { 
    QrCode, Ticket, Users, CheckCircle2, 
    ArrowRight, Scan, Plus, User 
} from "lucide-react";
import { Link, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BranchAdminDashboard({ branchName, stats, recentClaims, topEmployees }: any) {
    return (
        <AppLayout>
            <Head title={`Dashboard - ${branchName}`} />
            
            <div className="space-y-8 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">{branchName}</h1>
                        <p className="text-muted-foreground text-sm">Branch Management & PPC Monitoring</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/branch/vouchers/scanner">
                            <Button variant="default" className="rounded-2xl gap-2 shadow-lg shadow-primary/20">
                                <Scan size={18} />
                                Open Scanner
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard 
                        title="Vouchers Issued" 
                        value={stats.total_vouchers} 
                        icon={<Ticket size={20} />} 
                        subtitle="Total generated"
                    />
                    <KpiCard 
                        title="Total Redemptions" 
                        value={stats.total_claims} 
                        icon={<CheckCircle2 size={20} className="text-emerald-500" />} 
                        subtitle="Customer claims"
                    />
                    <KpiCard 
                        title="Claims Today" 
                        value={stats.today_claims} 
                        icon={<QrCode size={20} className="text-blue-500" />} 
                        subtitle="Scan activity"
                    />
                    <KpiCard 
                        title="Staff Members" 
                        value={stats.active_employees} 
                        icon={<Users size={20} />} 
                        subtitle="Active at branch"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Claims Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-lg">Recent Claims</h3>
                            <Link href="/branch/vouchers/claims" className="text-xs text-primary font-bold hover:underline">
                                View all claims
                            </Link>
                        </div>
                        
                        <div className="grid gap-3">
                            {recentClaims.length > 0 ? recentClaims.map((claim: any) => (
                                <div key={claim.id} className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-[1.5rem] hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{claim.customer_name}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
                                                {claim.voucher?.code} • {claim.voucher?.template?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium">{new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-[10px] text-muted-foreground">Today</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center border-2 border-dashed rounded-[2rem] text-muted-foreground">
                                    No claims recorded yet today.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Performing Staff */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg px-2">Top Issuers</h3>
                        <div className="rounded-[2rem] border bg-card p-6 space-y-6 shadow-sm">
                            {topEmployees.map((emp: any, index: number) => (
                                <div key={emp.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                                                {emp.name.charAt(0)}
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute -top-1 -right-1 bg-amber-400 text-[8px] px-1 rounded-full text-white font-bold">#1</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">{emp.name}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">Staff Member</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="rounded-lg h-6 font-bold text-[10px]">
                                        {emp.vouchers_count} Issued
                                    </Badge>
                                </div>
                            ))}
                            
                            <Link href="/branch/employees">
                                <Button variant="outline" className="w-full rounded-xl mt-4 text-xs h-10 border-dashed">
                                    Manage All Personnel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}