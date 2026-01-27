import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function Pagination({
    users,
}: {
    users: {
        links: PaginationLink[];
        meta?: { from: number | null; to: number | null; total: number };
        from?: number | null;
        to?: number | null;
        total?: number;
    };
}) {
    const meta = users.meta ?? {
        from: users.from ?? 0,
        to: users.to ?? 0,
        total: users.total ?? 0,
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                    {meta.from ?? 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                    {meta.to ?? 0}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                    {meta.total ?? 0}
                </span>{" "}
                results
            </p>

            <div className="flex flex-wrap gap-2">
                {users.links.map((l, idx) => (
                    <button
                        key={idx}
                        disabled={!l.url}
                        onClick={() => l.url && router.visit(l.url)}
                        className={cn(
                            "rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold transition",
                            l.active
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "hover:bg-muted",
                            !l.url && "opacity-50 cursor-not-allowed"
                        )}
                        dangerouslySetInnerHTML={{ __html: l.label }}
                    />
                ))}
            </div>
        </div>
    );
}
