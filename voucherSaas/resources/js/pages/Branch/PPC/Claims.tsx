import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Mail, Calendar, Hash } from 'lucide-react';
import Pagination from '@/components/pagination';

export default function Claims({ claims, filters }: any) {
    const updateFilter = (value: string) => {
        router.get('/branch/vouchers/claims', { search: value }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Voucher Claims" />

            <div className=" space-y-8 p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Premsons Privilage Claims</h1>
                    <p className="text-muted-foreground mt-1">Monitor all customers who have successfully redeemed their privilege codes.</p>
                </div>

                <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/20">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by customer name or email..."
                                value={filters.search || ''}
                                onChange={(e) => updateFilter(e.target.value)}
                                className="pl-10 rounded-xl bg-background border-border/40"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border/40">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Premsons Privilage Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Style Used</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Claimed Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {claims.data.map((claim: any) => (
                                    <tr key={claim.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{claim.customer_name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail size={12} /> {claim.customer_email || 'No Email'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hash size={14} className="text-primary" />
                                                <span className="font-mono font-bold text-sm">{claim.voucher?.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="rounded-lg font-medium">
                                                {claim.voucher?.template?.name || 'Standard'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Calendar size={14} />
                                                {new Date(claim.created_at).toLocaleDateString(undefined, { 
                                                    day: 'numeric', 
                                                    month: 'short', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-muted/10 border-t border-border/40">
                        <Pagination users={claims} />
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}