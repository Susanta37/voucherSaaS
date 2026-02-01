    import * as React from "react";

    export default function KpiCard({
        title,
        value,
        subtitle,
        icon,
    }: {
        title: string;
        value: number | string;
        subtitle?: string;
        icon?: React.ReactNode;
    }) {
        return (
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">{title}</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {icon && (
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )}
                </div>

                <div className="mt-4 h-1.5 w-full rounded-full bg-muted/40">
                    <div className="h-1.5 w-[65%] rounded-full bg-primary/30" />
                </div>
            </div>
        );
    }
