import { Menu, Bell, UserCircle } from "lucide-react";

export default function Navbar({ onMenuClick, title }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-500 hover:text-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 text-slate-700">
          <UserCircle className="w-7 h-7 text-slate-400" />
          <span className="text-sm font-medium hidden sm:inline">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
}