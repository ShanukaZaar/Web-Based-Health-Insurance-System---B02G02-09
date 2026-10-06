import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Building2,
  Wallet,
  MessageSquareText,
  BarChart3,
  X,
} from "lucide-react";

const links = [
  { to: "/policies", label: "Policy Management", icon: ShieldCheck },
  { to: "/claims", label: "Claim Management", icon: FileText },
  { to: "/hospitals", label: "Hospital Management", icon: Building2 },
  { to: "/payments", label: "Payment Management", icon: Wallet },
  { to: "/support", label: "Customer Support", icon: MessageSquareText },
  { to: "/admin/reports", label: "Reporting & Admin", icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-slate-900 text-slate-200
        transform transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="font-semibold text-white tracking-tight">
              HealthInsure
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}