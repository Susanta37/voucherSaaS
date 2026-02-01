import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, MoreVertical, Trash2, Edit2, 
    Layout as LayoutIcon, Image as ImageIcon, 
    CheckCircle, List 
} from 'lucide-react';
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import KpiCard from '@/components/kpi-card';
import AppLayout from '@/layouts/app-layout';

interface Template {
    id: number;
    name: string;
    background_image: string;
    layout: {
        qr_x: number;
        qr_y: number;
        qr_size: number;
    };
    is_active: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    templates: {
        data: Template[];
        total: number;
        links: PaginationLink[];
    };
}

export default function Index({ templates }: Props) {
    
    const handleDelete = (id: number) => {
        if (confirm('Delete this template? This cannot be undone.')) {
            router.delete(`/admin/templates/${id}`);
        }
    };

    const activeCount = templates.data.filter(t => t.is_active).length;

    return (
        <AppLayout
        >
            <Head title="Templates" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                
                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard 
                        title="Total Templates" 
                        value={templates.total} 
                        icon={<List className="w-5 h-5" />}
                        subtitle="Stored in library"
                    />
                    <KpiCard 
                        title="Active Templates" 
                        value={activeCount} 
                        icon={<CheckCircle className="w-5 h-5" />}
                        subtitle="Currently available for use"
                    />
                    <div className="flex items-center justify-end">
                         <Button asChild size="lg" className="rounded-2xl h-full w-full md:w-auto px-10">
                            <Link href="/admin/templates/create">
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Premsons Templete
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                {templates.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.data.map((template) => (
                                <Card key={template.id} className="overflow-hidden border-border/50 group">
                                    <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                                        <img 
                                            src={`/storage/${template.background_image}`} 
                                            alt={template.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge variant={template.is_active ? "default" : "secondary"} className="shadow-sm">
                                                {template.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium truncate">
                                            {template.name}
                                        </CardTitle>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/templates/${template.id}/edit`}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    onClick={() => handleDelete(template.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    
                                    <CardFooter className="px-4 py-3 bg-muted/20 flex gap-4 border-t text-muted-foreground">
                                        <div className="flex items-center text-xs italic">
                                            <LayoutIcon className="w-3 h-3 mr-1" />
                                            QR: {template.layout.qr_size}px
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10">
                            {templates.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="min-w-[40px]"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/60">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No templates found</h3>
                        <p className="text-muted-foreground mb-6">Start by designing your first voucher template.</p>
                        <Button asChild>
                            <Link href="/admin/templates/create">Create Template</Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}