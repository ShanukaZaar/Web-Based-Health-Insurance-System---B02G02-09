import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Activity, 
  Menu,
  X,
  Bot
} from 'lucide-react';
import AiNotificationsPopover from '../ai/AiNotificationsPopover';

const Navbar = ({ onOpenAiAssistant, toggleMobileSidebar, isMobileSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                CarePulse <span className="text-emerald-600">Health</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Insurance Portal
              </span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:block">Health Insurance Management System</span>
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies, claims, hospitals..."
            className="w-full bg-slate-50 hover:bg-white border border-slate-200 text-slate-900 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls: AI Assistant Button, Alerts, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ask AI Assistant Trigger */}
        <button
          onClick={onOpenAiAssistant}
          className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
          </button>
          
          <AiNotificationsPopover
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onSelectNotification={() => setShowNotifications(false)}
          />
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Chip */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm flex items-center justify-center">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">Admin Portal</span>
            <span className="text-[11px] text-slate-500 font-medium">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
