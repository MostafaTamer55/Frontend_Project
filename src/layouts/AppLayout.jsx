import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
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
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const isAccountActive =
    location.pathname === '/profile' ||
    location.pathname === '/settings';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Lectures', path: '/lectures', icon: BookOpen },
    { name: 'Sections', path: '/sections', icon: Layers },
    { name: 'Exam Bank', path: '/exams', icon: FolderArchive },
  ];

  return (
    <div
      className="min-h-screen text-[#15313C] selection:bg-[#CCEB74] selection:text-[#15313C] flex flex-col relative overflow-x-hidden"
      style={{
        background:
          'radial-gradient(circle at 5% 12%, #F0FAD0 0%, rgba(248, 250, 246, 0.6) 32%, transparent 65%), radial-gradient(circle at 18% 42%, #E7F7BA 0%, rgba(248, 250, 246, 0.5) 28%, transparent 60%), radial-gradient(circle at 95% 26%, #E0F2F6 0%, rgba(248, 250, 246, 0.55) 32%, transparent 65%), radial-gradient(circle at 86% 70%, #E8F5F8 0%, rgba(248, 250, 246, 0.45) 28%, transparent 60%), #F8FAF6',
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
                  {Icon && <Icon className="w-3.5 h-3.5" />}
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
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isAccountActive
                  ? 'bg-[#EAF7C6] text-[#15313C] border border-[#CCEB74]/80 hover:bg-[#E2F3B6]'
                  : 'bg-white text-[#15313C] border border-[#D7E0E3] hover:bg-slate-50'
              }`}
            >
              <User
                className={`w-3.5 h-3.5 ${
                  isAccountActive ? 'text-[#15313C]' : 'text-[#6B8089]'
                }`}
              />
              <span>Account</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAccountActive ? 'text-[#15313C]' : 'text-[#6B8089]'
                } ${accountMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Account Menu Popover (matches Figma Image 1) */}
            {accountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 rounded-[24px] bg-white shadow-[0_20px_45px_rgba(21,49,60,0.14)] border border-[#EAF0F2] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header */}
                  <div className="px-3.5 pt-3 pb-3">
                    <p className="text-sm font-bold text-[#15313C] truncate leading-tight">
                      {currentUser?.name || 'Student name'}
                    </p>
                    <p className="text-xs text-[#8DA6AF] truncate mt-0.5 font-normal">
                      {currentUser?.email || 'name@example.com'}
                    </p>
                  </div>

                  {/* Nav Links */}
                  <div className="space-y-1">
                    {/* Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                        location.pathname === '/profile'
                          ? 'bg-[#EAF7C6] text-[#15313C] font-semibold rounded-2xl'
                          : 'text-[#15313C] hover:bg-[#F5F8F9] rounded-2xl font-medium'
                      }`}
                    >
                      <User className="w-4 h-4 text-[#15313C] stroke-[2]" />
                      <span>Profile</span>
                    </Link>

                    {/* Settings */}
                    <Link
                      to="/settings"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                        location.pathname === '/settings'
                          ? 'bg-[#EAF7C6] text-[#15313C] font-semibold rounded-2xl'
                          : 'text-[#15313C] hover:bg-[#F5F8F9] rounded-2xl font-medium'
                      }`}
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#15313C] stroke-[2.2]" />
                      <span>Settings</span>
                    </Link>

                    {/* Progress */}
                    <Link
                      to="/progress"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                        location.pathname === '/progress'
                          ? 'bg-[#EAF7C6] text-[#15313C] font-semibold rounded-2xl'
                          : 'text-[#15313C] hover:bg-[#F5F8F9] rounded-2xl font-medium'
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-[#15313C] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span>Progress</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#EAF0F2] my-2" />

                  {/* Log Out */}
                  <div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-[#15313C] hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 stroke-[2]" />
                      <span>Log Out</span>
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
                {Icon && <Icon className="w-4 h-4" />}
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
