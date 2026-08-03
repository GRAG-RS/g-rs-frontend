import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  UserCircle, 
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../auth/authHooks';
import { ROUTES } from '../../constants/routes';

const navItems = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, badge: null },
  { name: 'Employees', path: ROUTES.EMPLOYEES, icon: Users, badge: 'ECS' },
  { name: 'Products', path: ROUTES.PRODUCTS, icon: Package, badge: 'ECS' },
  { name: 'Profile', path: ROUTES.PROFILE, icon: UserCircle, badge: null },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col h-full shadow-2xl z-20 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/80 justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">CorpDash</h1>
            <span className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> ALB Routing
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Nav */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center">
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center space-x-3 truncate">
            <div className="relative flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
            </div>
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-white leading-tight truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@company.com'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center px-3.5 py-2.5 text-xs font-semibold text-rose-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20 transition-all duration-200 group mt-2"
        >
          <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
