import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Building2, 
  LifeBuoy, 
  ShieldAlert,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/policies', label: 'Policy Management', icon: ShieldCheck, color: 'text-cyan-400' },
    { path: '/claims', label: 'Claim Management', icon: FileText, color: 'text-indigo-400' },
    { path: '/payments', label: 'Payment Processing', icon: CreditCard, color: 'text-emerald-400' },
    { path: '/hospitals', label: 'Hospital Network', icon: Building2, color: 'text-rose-400' },
    { path: '/support', label: 'Customer Support', icon: LifeBuoy, color: 'text-sky-400' },
    { path: '/admin', label: 'Admin & Reports', icon: ShieldAlert, color: 'text-purple-400' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
            Core Modules
          </span>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs font-medium text-slate-300 block">API Status</span>
            <span className="text-[10px] text-slate-500">Connected: localhost:8080</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
