import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Building2, 
  LifeBuoy, 
  ShieldAlert,
  Sparkles,
  Settings,
  Activity,
  BrainCircuit,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/policies', label: 'Policies', icon: ShieldCheck },
    { path: '/claims', label: 'Claims', icon: FileText },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/hospitals', label: 'Hospitals', icon: Building2 },
    { path: '/support', label: 'Support', icon: LifeBuoy },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Reports & Admin', icon: ShieldAlert },
    { path: '/ai-insights', label: 'AI Insights', icon: BrainCircuit, isAi: true },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 bg-white">
      <div className="space-y-6">
        {/* Core Navigation */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block">
            Core Modules
          </span>
          <nav className="mt-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI & Admin Navigation */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block">
            Administration
          </span>
          <nav className="mt-2 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.isAi && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Status Widget */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">System Status</span>
              <span className="text-[10px] text-slate-500">API Connected :8088</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
            Online
          </span>
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Health Insurance System • MLBB2G209
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block min-h-[calc(100vh-4rem)] shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white border-r border-slate-200 h-full z-10 shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Navigation Menu
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
