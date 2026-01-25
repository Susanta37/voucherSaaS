import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
  return (
    <>
      <Head title="Premsons Motor Group | Voucher & QR System" />

      <div className="min-h-screen bg-background text-foreground">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* soft red glow */}
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-500/15 blur-3xl" />
          <div className="absolute -bottom-48 right-0 h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
        </div>

        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo + Tagline */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm">
                <img
                  src="/images/logo.png"
                  alt="Premsons Motor Group"
                  className="h-8 w-auto"
                />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-5">
                  Premsons Motor Group
                </p>
                <p className="text-xs text-muted-foreground">
                  Multi-Branch Voucher & QR Claim Platform
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Live showroom voucher tracking system
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Smart{" "}
                  <span className="text-red-600">Voucher & QR</span>{" "}
                  management for all branches.
                </h1>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  A modern voucher system for Premsons Motor Group.
                  Employees can register customer details, generate QR vouchers,
                  and send offer links via Email & WhatsApp — with full tracking.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                  >
                    Login to Dashboard
                  </Link>

                  <Link
                    href="https://premsonsmotor.com/"
                    className="inline-flex items-center justify-center rounded-2xl border border-border/60 bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition"
                  >
                    Visit Official Website
                  </Link>
                </div>

                {/* Mini Stats */}
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard
                    title="Multi Branch"
                    value="Central Control"
                    desc="One company, many branches"
                  />
                  <StatCard
                    title="Role Based"
                    value="Secure Access"
                    desc="Admin → Staff flow"
                  />
                  <StatCard
                    title="Tracking"
                    value="Realtime Logs"
                    desc="Voucher claims & history"
                  />
                </div>
              </div>

              {/* Right Preview Card */}
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-red-500/20 via-transparent to-transparent blur-2xl" />

                <div className="relative rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Branch Dashboard Preview
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Customer → Voucher → QR → Claim tracking
                      </p>
                    </div>

                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                      Premium
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <FeatureRow
                      title="Customer Registration"
                      desc="Employee saves buyer info with custom fields"
                    />
                    <FeatureRow
                      title="Instant QR Voucher"
                      desc="Generate unique QR with admin template"
                    />
                    <FeatureRow
                      title="Send via WhatsApp & Email"
                      desc="Wauper + Mailjet integration with delivery logs"
                    />
                    <FeatureRow
                      title="Claim Form"
                      desc="Customer scans QR and submits claim details"
                    />
                    <FeatureRow
                      title="Branch-wise Reports"
                      desc="Track all claims, activity, and voucher usage"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4">
                    <p className="text-xs font-semibold text-foreground">
                      Best for showroom campaigns
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Accessories vouchers • Service offers • Referral bonus •
                      Festive promos • Warranty add-ons
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/10">
                        <span className="text-xs font-bold text-red-600">
                          QR
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Fast & Mobile Friendly
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Easy to use for customers
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/login"
                      className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
                    >
                      Continue
                    </Link>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Powered by <a href="https://incusocio.com/ " className="underline cursor-pointer text-red-400">Incusocio</a>
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/60">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Premsons Motor Group. All rights
                reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-foreground transition">
                  Sign in
                </Link>
                <a
                  href="https://premsonsmotor.com/"
                  className="hover:text-foreground transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Website
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

/* ---------- Small Components ---------- */

function StatCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-4">
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-red-500/10">
        <span className="text-xs font-bold text-red-600">✓</span>
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
