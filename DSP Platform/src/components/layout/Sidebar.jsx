import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import {
  LayoutDashboard,
  Video,
  Layers,
  FileQuestion,
  TrendingUp,
  Settings,
  Sparkles,
  LogOut,
  Radio,
} from 'lucide-react';

const navigationLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Lectures', path: '/lectures', icon: Video, badge: '12' },
  { name: 'Sections', path: '/sections', icon: Layers, badge: '6' },
  { name: 'Exam Bank', path: '/exams', icon: FileQuestion },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ className = '' }) => {
  const { currentUser, logout } = useAuth();

  return (
    <aside className={`w-64 bg-white border-r border-slate-200/90 flex flex-col h-screen shrink-0 sticky top-0 ${className}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-base block leading-none">
            DSP Platform
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
            Signal Academy
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navigationLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-colors" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Pro Study Card / Hint */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-brand-900 to-slate-900 text-white shadow-lg shadow-brand-950/10">
        <div className="flex items-center gap-2 mb-2 text-accent-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">Midterm Prep</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Test your FFT & Z-Transform knowledge in the Exam Bank.
        </p>
        <Link
          to="/exams"
          className="inline-flex items-center text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          Take Practice Quiz
        </Link>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center text-xs border border-brand-200">
            {currentUser?.name
              ? currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              : 'ER'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {currentUser?.name || 'Eman R.'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {currentUser?.role === 'instructor' ? 'Course Instructor' : 'DSP Student #402'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
