import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
  return (
    <>
      <Head title="Voucher SaaS" />

      <div className="min-h-screen bg-background text-foreground">
        {/* Top Nav */}
        <header className="border-b border-border/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
                <span className="text-lg font-bold text-primary">V</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-4">Voucher SaaS</p>
                <p className="text-xs text-muted-foreground">
                  QR Voucher & Offer Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
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
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Production-ready SaaS foundation
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Generate vouchers, send QR links, and track claims —{" "}
                  <span className="text-primary">branch-wise</span>.
                </h1>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  A multi-tenant SaaS built for businesses with multiple branches.
                  Employees can register customers, generate QR vouchers, and send
                  offers via Email & WhatsApp — all from one dashboard.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    Create your workspace
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl border border-border/60 bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition"
                  >
                    Login to dashboard
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard title="Multi-tenant" value="Clients" desc="Manage multiple companies" />
                  <StatCard title="Branch-wise" value="Control" desc="Each branch has its own view" />
                  <StatCard title="QR + Claim" value="Tracking" desc="Track customer claims easily" />
                </div>
              </div>

              {/* Right Side Card */}
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl" />

                <div className="relative rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Voucher Overview</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Preview how your branches will operate
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Live
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <FeatureRow
                      title="Role-based dashboards"
                      desc="Super Admin → Company Admin → Branch Admin → Employee"
                    />
                    <FeatureRow
                      title="Customer onboarding"
                      desc="Employee registers buyer details with custom fields"
                    />
                    <FeatureRow
                      title="Voucher templates"
                      desc="Admin controls design, expiry, and rules"
                    />
                    <FeatureRow
                      title="Send via Mailjet & WhatsApp"
                      desc="Automatic delivery + logs for each message"
                    />
                    <FeatureRow
                      title="Claim form analytics"
                      desc="Track voucher opens, submissions, and redemption status"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4">
                    <p className="text-xs font-semibold text-foreground">
                      Example use cases
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Car showrooms • Retail stores • Service centers • Restaurants •
                      Gyms • Electronics shops
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center">
                        <span className="text-primary text-sm font-bold">QR</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Generate & Share</p>
                        <p className="text-xs text-muted-foreground">
                          Secure voucher codes
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/register"
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      Start now
                    </Link>
                  </div>
                </div>

                {/* Footer hint */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Built with Laravel 12 • Inertia • React • Tailwind
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/60">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Voucher SaaS. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-foreground transition">
                  Sign in
                </Link>
                <Link href="/register" className="hover:text-foreground transition">
                  Get started
                </Link>
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
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-4">
      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-primary/10 grid place-items-center">
        <span className="text-primary text-xs font-bold">✓</span>
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
