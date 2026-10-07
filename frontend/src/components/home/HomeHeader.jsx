import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const NAV = [
    { label: "Home", href: "#top" },
    { label: "Modules", href: "#modules" },
    { label: "How it works", href: "#how-it-works" },
    { label: "AI Insights", href: "#ai" },
    { label: "Contact", href: "#contact" },
];

export function Logo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Icon name="shield" className="h-6 w-6" />
            </div>
            <div className="leading-tight">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">
                        CarePulse <span className="text-emerald-600">Health</span>
                    </span>
                    <span className="hidden rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:inline">
                        Insurance Portal
                    </span>
                </div>
                <p className="text-xs text-slate-500">
                    Health Insurance Management System
                </p>
            </div>
        </div>
    );
}

export default function HomeHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <a href="#top" aria-label="CarePulse Health home">
                    <Logo />
                </a>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {NAV.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden items-center gap-3 lg:flex">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                        <Icon name="sparkles" className="h-4 w-4" />
                        AI Assistant
                    </button>
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
                    >
                        <Icon name="bell" />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </button>
                    <Link
                        to="/dashboard"
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        Open Portal
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 lg:hidden"
                >
                    <Icon name={open ? "close" : "menu"} />
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
                    {NAV.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                            {item.label}
                        </a>
                    ))}
                    <Link
                        to="/dashboard"
                        className="mt-2 block rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                        Open Portal
                    </Link>
                </div>
            )}
        </header>
    );
}
