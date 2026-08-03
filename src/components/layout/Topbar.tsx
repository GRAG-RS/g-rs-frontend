import React from 'react';
import { Bell, Search, Server } from 'lucide-react';
import { useAuth } from '../../auth/authHooks';

export const Topbar: React.FC = () => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 z-10 sticky top-0 transition-all">
      <div className="flex flex-1 items-center space-x-4">
        <div className="w-full max-w-sm relative text-slate-400 focus-within:text-blue-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-10 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-sm transition-all shadow-inner"
            placeholder="Quick search microservices..."
            type="search"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 rounded border border-slate-300/50">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* ALB Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Server className="h-3.5 w-3.5 text-slate-500" />
          <span>ALB Connected</span>
        </div>

        {/* Notifications Button */}
        <button className="relative rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 ring-2 ring-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};
