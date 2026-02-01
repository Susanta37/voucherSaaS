import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Plus, Mail, MessageSquare, Ticket, 
    Search, Filter, ExternalLink, User,
    Smartphone, CheckCircle2
} from 'lucide-react';

import KpiCard from '@/components/kpi-card';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface Template {
    id: number;
    name: string;
}

export default function PPCIndex({ vouchers, templates, kpis, filters }: any) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        template_id: '',
        customer_name: '',
        customer_email: '',
        customer_whatsapp: '',
        send_via_email: true,
        send_via_whatsapp: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/branch/vouchers', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const updateFilter = (key: string, value: any) => {
        router.get('/branch/vouchers', {
            ...filters,
            [key]: value,
        }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Privilege Codes" />

            <div className=" space-y-8 p-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Privilege Codes</h1>
                        <p className="text-muted-foreground mt-1">Generate and manage unique customer incentive codes.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl shadow-sm"
                            onClick={() => router.visit('/admin/templates')}
                        >
                            Design Library
                        </Button>
                        
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
                                    <Plus size={18} /> Generate New PPC
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                                <div className="bg-primary/5 p-6 border-b border-primary/10">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">New Privilege Code</DialogTitle>
                                        <DialogDescription>Fill in customer details to generate a unique voucher.</DialogDescription>
                                    </DialogHeader>
                                </div>

                                <form onSubmit={submit} className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Voucher Style</Label>
                                            <Select onValueChange={(val) => setData('template_id', val)}>
                                                <SelectTrigger className="rounded-xl h-12">
                                                    <SelectValue placeholder="Select a template" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {templates.map((t: Template) => (
                                                        <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.template_id && <p className="text-xs text-destructive mt-1">{errors.template_id}</p>}
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Info</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    placeholder="Full Name"
                                                    className="pl-10 rounded-xl h-12"
                                                    value={data.customer_name}
                                                    onChange={e => setData('customer_name', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    placeholder="WhatsApp"
                                                    className="pl-10 rounded-xl h-12"
                                                    value={data.customer_whatsapp}
                                                    onChange={e => setData('customer_whatsapp', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                <Input
                                                    placeholder="Email Address"
                                                    className="pl-10 rounded-xl h-12"
                                                    value={data.customer_email}
                                                    onChange={e => setData('customer_email', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    <div className="flex justify-center gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-md border-muted text-primary focus:ring-primary"
                                                checked={data.send_via_email}
                                                onChange={(e) => setData('send_via_email', e.target.checked)}
                                            />
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Send Email</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-md border-muted text-primary focus:ring-primary"
                                                checked={data.send_via_whatsapp}
                                                onChange={(e) => setData('send_via_whatsapp', e.target.checked)}
                                            />
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">WhatsApp Notify</span>
                                        </label>
                                    </div>

                                    <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" disabled={processing}>
                                        {processing ? 'Crafting Voucher...' : 'Generate & Dispatch'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard
                        title="Voucher Output"
                        value={kpis.total}
                        icon={<Ticket size={20} />}
                        subtitle="Total generated to date"
                    />
                    <KpiCard
                        title="Customer Engagement"
                        value={kpis.claims}
                        icon={<CheckCircle2 size={20} />}
                        subtitle="Successful voucher claims"
                    />
                    <KpiCard
                        title="Active Velocity"
                        value={kpis.today}
                        icon={<MessageSquare size={20} />}
                        subtitle="New codes generated today"
                    />
                </div>

                {/* Filters & Content Area */}
                <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by code or customer..."
                                    value={filters.search || ''}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                    className="pl-10 rounded-xl bg-background border-border/40"
                                />
                            </div>
                            <Select
                                value={filters.template_id || ''}
                                onValueChange={(val) => updateFilter('template_id', val)}
                            >
                                <SelectTrigger className="w-56 rounded-xl bg-background border-border/40">
                                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="All Templates" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Designs</SelectItem>
                                    {templates.map((t: Template) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border/40">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Unique Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Client Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Applied Style</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Redemptions</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Options</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {vouchers.data.map((v: any) => (
                                    <tr key={v.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-black text-primary text-sm">{v.code}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{new Date(v.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{v.claims[0]?.customer_name || 'Anonymous User'}</span>
                                                <span className="text-xs text-muted-foreground">{v.claims[0]?.customer_whatsapp || 'No contact provided'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="rounded-lg bg-background font-medium px-3 py-1">
                                                {v.template?.name}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center h-8 w-12 rounded-lg bg-secondary/50 text-secondary-foreground font-bold text-xs border border-border/40">
                                                {v.claims_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                onClick={() => window.open(`/storage/${v.image_path}`)}
                                            >
                                                <ExternalLink size={14} className="mr-2" /> View Asset
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-muted/10 border-t border-border/40">
                        <Pagination users={vouchers} />
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}