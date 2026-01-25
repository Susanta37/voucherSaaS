import AppLogoIcon from "@/components/app-logo-icon";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { home } from "@/routes";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
            {/* Soft Accent Background (20%) */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-red-500/5 blur-3xl" />
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <Link
                    href={home()}
                    className="flex items-center justify-center"
                >
                    <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
                        <AppLogoIcon className="h-10 w-auto" />
                    </div>
                </Link>

                {/* Auth Card */}
                <Card className="rounded-2xl border-border/60 shadow-sm">
                    <CardHeader className="px-8 pt-8 pb-0 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            {title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm">
                            {description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 py-8">
                        {children}
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Premsons Motor Group. All rights reserved.
                </p>
            </div>
        </div>
    );
}
