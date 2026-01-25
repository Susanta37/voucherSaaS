import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import type { AuthLayoutProps, SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-dvh lg:grid-cols-2">
            {/* Left Branding Panel */}
            <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-zinc-950" />

                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-black/30 blur-3xl" />
                </div>

                {/* Top Logo */}
                <div className="relative z-10 p-10">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3"
                    >
                        <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                            <AppLogoIcon className="h-8" />
                        </div>

                        <div className="text-left">
                            <p className="text-lg font-semibold text-white leading-5">
                                Premsons Motor Group
                            </p>
                            <p className="text-xs text-white/80">
                                Voucher & QR Claim Platform
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Center Message */}
                <div className="relative z-10 px-10 pb-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">
                        Manage vouchers smarter,
                        <br />
                        across every branch.
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                        Employees can register customers, generate QR vouchers,
                        and send offers via Email & WhatsApp. Track claims,
                        delivery logs, and branch performance — securely.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                            Multi-Branch
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                            Role-Based Access
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                            QR + Claim Tracking
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                            Email + WhatsApp Delivery
                        </span>
                    </div>

                    <p className="mt-8 text-xs text-white/70">
                        Powered by Incusocio
                    </p>
                </div>
            </div>

            {/* Right Auth Panel */}
            <div className="flex items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Link href={home()} className="inline-flex items-center">
                            <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-white">
                                <AppLogoIcon className="h-8 sm:h-10" />
                            </div>
                        </Link>
                    </div>

                    {/* Auth Card */}
                    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                        <div className="space-y-2 text-left sm:text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="mt-6">{children}</div>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Premsons Motor Group. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
