import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Search, User, Mail, Calendar, Hash, 
    Car, MessageSquare, Globe, Smartphone,
    TicketCheck, Users, Activity
} from 'lucide-react';
import KpiCard from '@/components/kpi-card'; // Using your provided component
import Pagination from '@/components/pagination'; // Using your provided component

export default function Claims({ claims, filters, stats }: any) {
    const updateFilter = (value: string) => {
        router.get('/branch/vouchers/claims', { search: value }, { 
            preserveState: true,
            replace: true 
        });
    };

    return (
        <AppLayout>
            <Head title="Voucher Claims" />

            <div className="space-y-8 p-4 md:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Privilege Claims</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Detailed logs of customers who have successfully redeemed privilege codes.
                    </p>
                </div>

                {/* KPI Section using your KpiCard component */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard 
                        title="Total Claims" 
                        value={stats.total_claims} 
                        subtitle="All time registrations"
                        icon={<TicketCheck size={20} />}
                    />
                    <KpiCard 
                        title="Claims Today" 
                        value={stats.today_claims} 
                        subtitle="Last 24 hours"
                        icon={<Activity size={20} />}
                    />
                    <KpiCard 
                        title="Unique Vehicles" 
                        value={stats.unique_vehicles} 
                        subtitle="Distinct registration numbers"
                        icon={<Car size={20} />}
                    />
                </div>

                {/* Data Table */}
                <Card className="rounded-[2rem] border-border/40 bg-card shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or vehicle..."
                                defaultValue={filters.search || ''}
                                onChange={(e) => updateFilter(e.target.value)}
                                className="pl-10 rounded-2xl bg-background border-border/40 h-11"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border/40">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer & Vehicle</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact & Device</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Voucher Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Claimed Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {claims.data.map((claim: any) => (
                                    <tr key={claim.id} className="hover:bg-muted/20 transition-colors group">
                                        {/* Customer & Vehicle */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{claim.customer_name}</span>
                                                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground mt-1 flex items-center gap-1 w-fit">
                                                        <Car size={10} /> {claim.vehicle_registration || 'No Plate'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact & Device */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Mail size={12} /> {claim.customer_email || 'No Email'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <MessageSquare size={12} className="text-emerald-500" /> {claim.customer_whatsapp || 'No WhatsApp'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 pt-1">
                                                    <Globe size={10} /> {claim.ip_address} 
                                                </div>
                                            </div>
                                        </td>

                                        {/* Voucher */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={14} className="text-primary" />
                                                    <span className="font-mono font-black text-xs tracking-tighter">{claim.voucher?.code}</span>
                                                </div>
                                                <Badge variant="secondary" className="w-fit text-[10px] uppercase font-bold py-0 h-5">
                                                    {claim.voucher?.template?.name}
                                                </Badge>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                {new Date(claim.created_at).toLocaleDateString(undefined, { 
                                                    day: 'numeric', month: 'short', year: 'numeric' 
                                                })}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground ml-6">
                                                {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with your Pagination component */}
                    <div className="p-6 bg-muted/10 border-t border-border/40">
                        <Pagination users={claims} />
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}