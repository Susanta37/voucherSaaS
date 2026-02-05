import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { 
    Ticket, QrCode, ShieldCheck, Zap, 
    Smartphone, BarChart3, Moon, Sun, 
    ArrowRight, CheckCircle2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Welcome() {
    const [isDark, setIsDark] = useState(false);

    // Sync theme with Shadcn/ui or Document element
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
            <Head title="Premsons Motor Group | Premium Voucher Ecosystem" />

            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
                <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="absolute left-[-10%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/10 dark:bg-red-500/5 blur-[120px]" />
            </div>

            {/* Navigation */}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
                <nav className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 px-4 py-3 backdrop-blur-xl shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto dark:invert" />
                        <span className="hidden md:block font-bold tracking-tight text-sm uppercase">Premsons Motor</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={toggleTheme} 
                            className="rounded-xl hover:bg-muted transition-all"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Link href="/login" className="text-sm font-medium hover:text-red-600 transition">Sign in</Link>
                        
                        <Link href="/login">
                            <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
                                Launch Dashboard
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="pt-32">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 mb-6">
                            <Zap className="h-3.5 w-3.5" />
                            New: Real-time WhatsApp Tracking Integrated
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            Smart <span className="text-red-600">Premsons Privilege</span> Offers & Membership <br className="hidden md:block" />
                            Management System.
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10">
                            Centralize your multi-branch customer engagement. Generate high-fidelity QR vouchers,
                            automated WhatsApp notifications, and real-time claim analytics in one premium dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg" className="h-14 px-8 rounded-2xl bg-red-600 text-lg hover:bg-red-700 shadow-xl shadow-red-500/20 group">
                                    Start Managing 
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="https://premsonsmotor.com/" target="_blank">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg">
                                    Showroom Portal
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Dashboard Mockup Preview */}
                   <div className="mt-20 relative max-w-5xl mx-auto animate-in zoom-in-95 duration-1000 delay-300">
                      <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-[2.5rem] blur-3xl opacity-20 dark:opacity-10" />
                      <div className="relative rounded-[2rem] border border-border bg-card/80 backdrop-blur-sm p-2 shadow-2xl transition-all duration-500">
                          <img 
                              // Switches image based on isDark state
                              src={isDark ? "/images/herob.png" : "/images/hero.png"} 
                              alt="Dashboard Interface"
                              className="rounded-[1.5rem] w-full shadow-inner transition-opacity duration-500"
                          />
                      </div>
                  </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-muted/30 dark:bg-slate-900/30 mt-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Engineered for Performance</h2>
                            <p className="text-muted-foreground">Every tool you need to track customer conversion across branches.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<QrCode className="h-8 w-8 text-red-600" />}
                                title="Dynamic QR Engine"
                                desc="Generate secure, non-repeatable QR codes mapped to specific branch campaigns."
                            />
                            <FeatureCard 
                                icon={<Smartphone className="h-8 w-8 text-red-600" />}
                                title="Multi-Channel Reach"
                                desc="Instant delivery via WhatsApp & Email with status logging for open rates."
                            />
                            <FeatureCard 
                                icon={<BarChart3 className="h-8 w-8 text-red-600" />}
                                title="Branch KPI Analytics"
                                desc="Real-time heatmap of which branches are issuing and claiming the most vouchers."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-12 px-4 md:px-0">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <img src="/images/logo.png" alt="Logo" className="h-6 w-auto grayscale dark:invert" />
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            © {new Date().getFullYear()} Premsons Motor Group. Empowering dealerships.
                        </p>
                    </div>

                    <div className="flex gap-8 text-xs font-medium text-muted-foreground">
                        <a href="#" className="hover:text-red-600 transition">Terms</a>
                        <a href="#" className="hover:text-red-600 transition">Privacy</a>
                        <a href="https://incusocio.com/" className="text-red-400 font-bold italic">Power by Incusocio</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="group rounded-[2rem] border border-border bg-card p-8 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300">
            <div className="mb-6 p-4 rounded-2xl bg-muted/50 w-fit group-hover:scale-110 group-hover:bg-red-500/10 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}