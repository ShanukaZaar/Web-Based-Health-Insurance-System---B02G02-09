import { useState } from "react";
import { Link } from "react-router-dom";
import HomeHeader from "../components/home/HomeHeader";
import HomeFooter from "../components/home/HomeFooter";
import Icon from "../components/home/Icon";

function SmartImage({ src, alt, className = "", eager = false }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 ${className}`}
                role="img"
                aria-label={alt}
            >
                <Icon name="shieldCheck" className="h-16 w-16" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
}

const STATS = [
    { value: "6", label: "Core modules" },
    { value: "7", label: "User roles" },
    { value: "24/7", label: "Online access" },
    { value: "100%", label: "Paperless workflow" },
];

const MODULES = [
    {
        title: "Policy Management",
        desc: "Browse packages, purchase, renew, modify or cancel coverage in a few clicks.",
        icon: "shieldCheck",
        to: "/policies",
    },
    {
        title: "Claim Management",
        desc: "Submit claims with documents, track every status and get clear decisions.",
        icon: "file",
        to: "/claims",
    },
    {
        title: "Payment Management",
        desc: "Pay premiums securely, download receipts and review your payment history.",
        icon: "card",
        to: "/payments",
    },
    {
        title: "Hospital Management",
        desc: "Verify eligibility, upload treatment records and submit bills directly.",
        icon: "building",
        to: "/hospitals",
    },
    {
        title: "Customer Support",
        desc: "Log complaints and inquiries, then follow each ticket through to resolution.",
        icon: "lifebuoy",
        to: "/support",
    },
    {
        title: "Reports & Administration",
        desc: "Manage users and roles, monitor system logs and generate analytics reports.",
        icon: "chart",
        to: "/admin",
    },
];

const STEPS = [
    { title: "Choose a policy", desc: "Compare packages and enter your details." },
    { title: "Pay your premium", desc: "Pay online and receive an instant receipt." },
    { title: "Submit a claim", desc: "Upload receipts and medical documents securely." },
    { title: "Track the decision", desc: "Get notified when your claim is approved or rejected." },
];

const ROLES = [
    "Customer",
    "Insurance Admin",
    "Claim Officer",
    "Finance Admin",
    "Hospital Staff",
    "Support Agent",
    "System Admin",
];

function SectionHeading({ eyebrow, title, subtitle }) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                {eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-base text-slate-500">{subtitle}</p>}
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <HomeHeader />

            <main>
                {/* HERO */}
                <section
                    id="top"
                    className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white"
                >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                                <Icon name="sparkles" className="h-3.5 w-3.5" />
                                AI-assisted health insurance
                            </span>
                            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Health insurance,
                                <span className="block text-emerald-600">simple and digital.</span>
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                                Buy and renew policies, submit medical claims, pay premiums and connect with
                                hospitals, all from one secure portal. No paperwork, no queues.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Link
                                    to="/policies"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                                >
                                    Explore policies
                                    <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/claims"
                                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                >
                                    Submit a claim
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                                <Icon name="lock" className="h-4 w-4 text-emerald-600" />
                                Role-based access and secure document handling
                            </div>
                        </div>

                        {/* Hero preview card (sample data) */}
                        {/* Hero image */}
                        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-emerald-200/60" />
                            <div className="relative overflow-hidden rounded-3xl border border-white shadow-2xl shadow-emerald-900/10">
                                <SmartImage
                                    src="/images/hero.jpg"
                                    alt="Doctor consulting a patient"
                                    eager
                                    className="aspect-[4/3] w-full"
                                />
                            </div>

                            {/* Floating card: claim status */}
                            <div className="absolute -left-4 top-8 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Icon name="shieldCheck" className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold">Claim approved</p>
                                    <p className="text-xs text-slate-500">CL-2041 · Outpatient</p>
                                </div>
                            </div>

                            {/* Floating card: AI risk check */}
                            <div className="absolute -bottom-6 left-6 hidden w-60 rounded-2xl border border-emerald-200 bg-white p-4 shadow-lg sm:block">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 font-semibold text-emerald-800">
                                        <Icon name="sparkles" className="h-4 w-4" />
                                        AI risk check
                                    </span>
                                    <span className="font-semibold text-emerald-700">Low · 12%</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
                                    <div className="h-full w-[12%] rounded-full bg-emerald-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS */}
                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {STATS.map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-3xl font-extrabold text-emerald-600">{s.value}</p>
                                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MODULES */}
                <section id="modules" className="bg-slate-50/60 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Core modules"
                            title="Everything your insurance needs, in one place"
                            subtitle="Six connected modules cover the full policy, claim and payment lifecycle."
                        />
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {MODULES.map((m) => (
                                <Link
                                    key={m.title}
                                    to={m.to}
                                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/5"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                        <Icon name={m.icon} className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold">{m.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{m.desc}</p>
                                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                                        Open module
                                        <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CARE NETWORK (side image) */}
                <section className="py-20">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                        {/* Image */}
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-emerald-200" />
                            <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10">
                                <SmartImage
                                    src="/images/care.jpg"
                                    alt="Hospital team caring for a patient"
                                    className="aspect-[6/5] w-full"
                                />
                            </div>
                            <div className="absolute -bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Icon name="building" className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold">Eligibility verified</p>
                                    <p className="text-xs text-slate-500">Instant hospital check</p>
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div>
                            <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Hospital network
                            </span>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Care that connects hospitals and insurers directly
                            </h2>
                            <p className="mt-4 text-slate-600">
                                Hospitals verify your coverage on the spot and upload treatment records and bills
                                straight to the insurer, so you spend less time on paperwork and more on recovery.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    { icon: "shieldCheck", t: "Instant eligibility checks", d: "Hospital staff confirm coverage before treatment begins." },
                                    { icon: "file", t: "Digital treatment records", d: "Diagnoses and bills are uploaded and stored securely." },
                                    { icon: "zap", t: "Faster claim settlement", d: "Verified records move claims through review sooner." },
                                ].map((f) => (
                                    <div key={f.t} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                            <Icon name={f.icon} className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold">{f.t}</p>
                                            <p className="mt-0.5 text-sm text-slate-500">{f.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/hospitals"
                                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                Explore hospital services
                                <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how-it-works" className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="How it works"
                            title="From sign-up to settlement in four steps"
                        />
                        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map((s, i) => (
                                <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                                    <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* AI SECTION */}
                <section id="ai" className="bg-slate-50/60 py-20">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                        <div>
                            <span className="inline-block rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                AI insights
                            </span>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Smarter claim checks, faster decisions
                            </h2>
                            <p className="mt-4 text-slate-600">
                                Configurable AI underwriting scores each claim for risk, so routine claims settle
                                quickly while unusual ones are flagged for a Claim Officer.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    "Adjustable risk sensitivity: conservative, balanced or aggressive",
                                    "Auto-approval limit for small, clean claims",
                                    "Instant alerts for high-risk claims",
                                ].map((t) => (
                                    <li key={t} className="flex items-start gap-3 text-sm text-slate-700">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                            <Icon name="check" className="h-3 w-3" />
                                        </span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="flex items-center gap-2 text-base font-bold">
                                <Icon name="sparkles" className="h-5 w-5 text-emerald-600" />
                                Risk sensitivity
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold">
                                <div className="rounded-lg border border-slate-200 py-3 text-slate-600">CONSERVATIVE</div>
                                <div className="rounded-lg border border-emerald-300 bg-emerald-50 py-3 text-emerald-800">BALANCED</div>
                                <div className="rounded-lg border border-slate-200 py-3 text-slate-600">AGGRESSIVE</div>
                            </div>
                            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                                <Icon name="zap" className="h-5 w-5 text-emerald-600" />
                                <p className="text-sm text-slate-600">
                                    Claims under the auto-approval limit with a clean document match settle
                                    automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROLES */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Built for everyone"
                            title="One portal, the right tools for every role"
                        />
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {ROLES.map((r) => (
                                <span
                                    key={r}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800"
                                >
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-14 text-center text-white shadow-xl shadow-emerald-700/20 sm:px-12">
                        <h2 className="text-3xl font-bold sm:text-4xl">Ready to go paperless?</h2>
                        <p className="mx-auto mt-3 max-w-xl text-emerald-50">
                            Get covered, pay online and track every claim from one secure dashboard.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link
                                to="/policies"
                                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                Get started
                            </Link>
                            <a
                                href="#contact"
                                className="rounded-xl border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Contact us
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <HomeFooter />
        </div>
    );
}