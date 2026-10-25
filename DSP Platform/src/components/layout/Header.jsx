import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Menu, Radio } from 'lucide-react';

const routeTitleMap = {
  '/dashboard': 'Student Dashboard',
  '/lectures': 'Course Lectures',
  '/sections': 'Practical Sections & Labs',
  '/exams': 'Exam Bank & Assessments',
  '/progress': 'Learning Analytics & Progress',
  '/settings': 'Account & Settings',
};

export const Header = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  // Find matching title or default
  const matchedKey = Object.keys(routeTitleMap).find(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );
  const currentTitle = matchedKey ? routeTitleMap[matchedKey] : 'DSP Learning Platform';

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>DSP Platform</span>
            <span>/</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Search Button (Desktop) */}
        <div className="hidden sm:flex items-center relative">
          <input
            type="text"
            placeholder="Quick search... (Press /)"
            className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
        </button>

        {/* User Pill */}
        <Link
          to="/settings"
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <span className="hidden lg:inline text-xs font-semibold text-slate-700">
            Eman R.
          </span>
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            ER
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
