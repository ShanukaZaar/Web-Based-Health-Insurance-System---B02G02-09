import React from 'react';
import { Shield, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-bold text-slate-100 text-base tracking-tight block leading-tight">
            Health Shield <span className="text-cyan-400 font-medium text-xs ml-1 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/50">SE2030 Scaffold</span>
          </span>
          <span className="text-xs text-slate-400">Web-Based Health Insurance System</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-slate-800" />
        <div className="flex items-center gap-3 pl-1">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-sm font-medium text-slate-200 block leading-tight">Group MLBB2G209</span>
            <span className="text-xs text-cyan-400">Software Engineering</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
