import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import {
  LayoutGrid,
  BookOpen,
  Layers,
  FolderArchive,
  TrendingUp,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Lectures', path: '/lectures', icon: BookOpen },
    { name: 'Sections', path: '/sections', icon: Layers },
    { name: 'Exam Bank', path: '/exams', icon: FolderArchive },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
  ];

  return (
    <div
      className="min-h-screen text-[#15313C] selection:bg-[#CCEB74] selection:text-[#15313C] flex flex-col"
      style={{
        background:
          'radial-gradient(circle at 10% 12%, #F1FBD2 0%, rgba(248, 250, 245, 0.5) 35%, #F8FAF5 65%), radial-gradient(circle at 88% 50%, #E7F6BE 0%, rgba(248, 250, 245, 0.45) 35%, #F8FAF5 70%), #F8FAF5',
      }}
    >
      {/* Top Floating Navigation Bar (Figma screen/dashboard/first-time-user) */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 max-w-[1140px] w-full mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#EAF0F2] shadow-[0_8px_25px_rgba(21,49,60,0.04)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Title */}
          <Link
            to="/dashboard"
            className="font-bold text-sm sm:text-base text-[#15313C] tracking-tight hover:opacity-90 shrink-0"
          >
            Digital Signal Processing
          </Link>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#EAF7C6] text-[#15313C] border border-[#CCEB74]/60 shadow-xs'
                        : 'text-[#6B8089] hover:text-[#15313C] hover:bg-[#F5F8F9]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Account Dropdown Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#15313C] bg-white border border-[#D7E0E3] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#6B8089]" />
              <span>Account</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#6B8089] transition-transform duration-200 ${
                  accountMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Account Menu Popover */}
            {accountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-[0_15px_35px_rgba(21,49,60,0.12)] border border-[#EAF0F2] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#15313C] truncate">
                      {currentUser?.name || 'Eman R.'}
                    </p>
                    <p className="text-[11px] text-[#6B8089] truncate">
                      {currentUser?.email || 'student@dsp.edu'}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#3A5560] hover:bg-[#F5F8F9] hover:text-[#15313C] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#6B8089]" />
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      to="/progress"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#3A5560] hover:bg-[#F5F8F9] hover:text-[#15313C] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#6B8089]" />
                      <span>My Progress</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (under header on small screens) */}
        <div className="flex md:hidden items-center justify-around bg-white/90 backdrop-blur-md rounded-2xl mt-2 p-1.5 border border-[#EAF0F2] shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-all ${
                    isActive
                      ? 'bg-[#EAF7C6] text-[#15313C]'
                      : 'text-[#6B8089] hover:text-[#15313C]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1140px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
