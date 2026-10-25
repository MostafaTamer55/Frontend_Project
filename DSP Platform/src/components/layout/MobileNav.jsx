import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Layers,
  FileQuestion,
  TrendingUp,
} from 'lucide-react';

const mobileNavLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Lectures', path: '/lectures', icon: Video },
  { name: 'Sections', path: '/sections', icon: Layers },
  { name: 'Exams', path: '/exams', icon: FileQuestion },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
];

/**
 * Mobile Bottom Navigation (Figma Page 11 Mobile Design Spec)
 * Fixed to bottom on screens < 768px
 */
export const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 px-2 py-1 safe-bottom">
      <div className="flex items-center justify-around">
        {mobileNavLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-brand-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
