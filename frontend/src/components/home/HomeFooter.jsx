import { Link } from "react-router-dom";
import { Logo } from "./HomeHeader";

const COLUMNS = [
    {
        title: "Core Modules",
        links: [
            { label: "Policies", to: "/policies" },
            { label: "Claims", to: "/claims" },
            { label: "Payments", to: "/payments" },
            { label: "Hospitals", to: "/hospitals" },
        ],
    },
    {
        title: "Administration",
        links: [
            { label: "Support", to: "/support" },
            { label: "Reports & Admin", to: "/admin" },
            { label: "AI Insights", to: "/admin" },
        ],
    },
];

export default function HomeFooter() {
    return (
        <footer id="contact" className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <Logo />
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
                            A secure web platform that digitizes health insurance operations, from buying a
                            policy to settling a claim, connecting customers, hospitals and the insurer in
                            one place.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {col.title}
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link
                                            to={l.to}
                                            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} CarePulse Health · SE2030 Group MLB-B2G2-09 · SLIIT
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        API Online
                    </span>
                </div>
            </div>
        </footer>
    );
}