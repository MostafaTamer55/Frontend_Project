import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  Lock,
  LogOut,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const SettingsPage = ({ defaultView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, updatePassword } = useAuth();

  // Determine initial view: main settings cards or change password view
  const isChangePasswordRoute =
    defaultView === 'change-password' ||
    location.pathname === '/settings/change-password';

  const [view, setView] = useState(
    isChangePasswordRoute ? 'change-password' : 'main'
  );

  // Profile data
  const [profile] = useState(() => {
    try {
      const saved = localStorage.getItem('dsp_profile_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      fullName: 'Student name',
      email: 'name@example.com',
      cohort: 'ECE 28',
    };
  });

  // Logout modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChangePassword = () => {
    setFieldErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setView('change-password');
  };

  const handleCancelChangePassword = () => {
    setFieldErrors({});
    setView('main');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!currentPassword.trim()) {
      errors.currentPassword = 'Enter your current password';
    }

    if (!newPassword) {
      errors.newPassword = 'Enter a new password';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Repeat the new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const targetEmail = currentUser?.email || profile.email;
      await updatePassword(targetEmail, newPassword);
      setIsLoading(false);
      setShowSuccessToast(true);

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Return to main view after toast
      setTimeout(() => {
        setShowSuccessToast(false);
        setView('main');
      }, 2500);
    } catch {
      setIsLoading(false);
      setFieldErrors({
        currentPassword: 'Failed to update password. Please try again.',
      });
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="relative w-full max-w-[1080px] mx-auto py-2 sm:py-6 animate-in fade-in duration-200">
      {/* Success Toast (matches Screenshot 3) */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 sm:right-10 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-white rounded-2xl border border-[#2E9E6B] shadow-[0_12px_35px_rgba(21,49,60,0.12)] p-4 pr-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2E9E6B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#15313C] leading-tight">
                Password updated
              </h4>
              <p className="text-xs text-[#5A737E] mt-0.5 font-normal">
                Your password has been changed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: CHANGE PASSWORD VIEW (Screenshots 1, 2, 3) */}
      {view === 'change-password' ? (
        <div>
          {/* Breadcrumb: Settings / Change password */}
          <div className="flex items-center gap-2 text-xs mb-6 text-[#5A737E]">
            <button
              type="button"
              onClick={handleCancelChangePassword}
              className="hover:text-[#15313C] transition-colors cursor-pointer"
            >
              Settings
            </button>
            <span className="text-[#8DA6AF]">/</span>
            <span className="font-semibold text-[#15313C]">
              Change password
            </span>
          </div>

          {/* Centered Change Password Card */}
          <div className="max-w-[580px] mx-auto bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-8 sm:p-11 border border-[#EAF0F2] shadow-[0_15px_40px_rgba(21,49,60,0.03)]">
            <h1 className="text-[30px] sm:text-[34px] font-bold text-[#15313C] tracking-tight leading-tight">
              Change password
            </h1>
            <p className="text-[#5A737E] text-sm mt-1.5 font-normal">
              Enter your current password, then choose a new one.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-8" noValidate>
              {/* Current Password Field */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-xs font-semibold text-[#15313C] mb-1.5"
                >
                  Current password
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                      fieldErrors.currentPassword
                        ? 'text-red-500'
                        : 'text-[#8DA6AF]'
                    }`}
                  >
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (fieldErrors.currentPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          currentPassword: undefined,
                        }));
                      }
                    }}
                    placeholder="Enter current password"
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                      fieldErrors.currentPassword
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-400'
                        : 'border-[#D7E0E3] bg-[#F5F8F9]/50 focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8DA6AF] hover:text-[#15313C] transition-colors"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.currentPassword}</span>
                  </p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs font-semibold text-[#15313C] mb-1.5"
                >
                  New password
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                      fieldErrors.newPassword
                        ? 'text-red-500'
                        : 'text-[#8DA6AF]'
                    }`}
                  >
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (fieldErrors.newPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          newPassword: undefined,
                        }));
                      }
                    }}
                    placeholder="Enter a new password"
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                      fieldErrors.newPassword
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-400'
                        : 'border-[#D7E0E3] bg-[#F5F8F9]/50 focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8DA6AF] hover:text-[#15313C] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.newPassword}</span>
                  </p>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-[#15313C] mb-1.5"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                      fieldErrors.confirmPassword
                        ? 'text-red-500'
                        : 'text-[#8DA6AF]'
                    }`}
                  >
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                      }
                    }}
                    placeholder="Repeat the new password"
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                      fieldErrors.confirmPassword
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-400'
                        : 'border-[#D7E0E3] bg-[#F5F8F9]/50 focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8DA6AF] hover:text-[#15313C] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Form Action Buttons (Cancel / Save password) */}
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-6 sm:px-7 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-sm font-semibold text-[#15313C] transition-all cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 sm:px-7 py-2.5 rounded-full bg-[#15313C] hover:bg-[#112730] active:scale-[0.98] text-[#CCEB74] text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#CCEB74] stroke-[2.5]" />
                  <span>{isLoading ? 'Saving...' : 'Save password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* VIEW 2: MAIN SETTINGS VIEW */
        <div>
          {/* Page Header (Title + Subtitle + Sample placeholders badge) */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7 sm:mb-9">
            <div>
              <h1 className="text-[38px] sm:text-[44px] font-bold text-[#15313C] tracking-tight leading-tight">
                Settings
              </h1>
              <p className="text-[#5A737E] text-[15px] sm:text-base mt-1 font-normal">
                Manage your account and password.
              </p>
            </div>

            {/* Top-Right Badge: Sample placeholders */}
            <div className="self-start sm:self-auto sm:mt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-[#DCE5E8] shadow-[0_2px_8px_rgba(21,49,60,0.03)] text-xs text-[#5A737E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E748B]" />
                <span>Sample placeholders</span>
              </div>
            </div>
          </div>

          {/* Top Row: 2 Cards (Account information & Password) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
            {/* Card 1: Account information */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 border border-[#EAF0F2] shadow-[0_15px_35px_rgba(21,49,60,0.03)] flex flex-col justify-between">
              <div>
                <h2 className="text-[21px] sm:text-[22px] font-bold text-[#15313C] tracking-tight mb-6 sm:mb-8">
                  Account information
                </h2>

                <div className="divide-y divide-[#EAF0F2]">
                  {/* Row 1: Full name */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                    <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                      Full name
                    </span>
                    <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                      {profile.fullName || 'Student name'}
                    </span>
                  </div>

                  {/* Row 2: Email */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                    <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                      Email
                    </span>
                    <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0 break-all">
                      {profile.email || 'name@example.com'}
                    </span>
                  </div>

                  {/* Row 3: Cohort */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                    <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                      Cohort
                    </span>
                    <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                      {profile.cohort || 'ECE 28'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Password */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 border border-[#EAF0F2] shadow-[0_15px_35px_rgba(21,49,60,0.03)] flex flex-col justify-between">
              <div>
                {/* Lock Icon in Lime Rounded Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] flex items-center justify-center text-[#15313C] mb-5">
                  <Lock className="w-5 h-5 text-[#15313C] stroke-[2]" />
                </div>

                <h2 className="text-[21px] sm:text-[22px] font-bold text-[#15313C] tracking-tight leading-tight">
                  Password
                </h2>
                <p className="text-[#5A737E] text-sm mt-1.5 font-normal">
                  Change the password you use to log in.
                </p>
              </div>

              {/* Change password button */}
              <div className="mt-8 sm:mt-10">
                <button
                  type="button"
                  onClick={handleOpenChangePassword}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] border border-[#D7E0E3] shadow-xs text-sm font-semibold text-[#15313C] transition-all cursor-pointer"
                >
                  <span>Change password</span>
                  <ArrowRight className="w-4 h-4 text-[#15313C] stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card: Session */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-[#EAF0F2] shadow-[0_15px_35px_rgba(21,49,60,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Icon + Text */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] flex items-center justify-center text-[#15313C] shrink-0">
                <LogOut className="w-5 h-5 text-[#15313C] stroke-[2]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-[20px] font-bold text-[#15313C] tracking-tight">
                  Session
                </h3>
                <p className="text-[#5A737E] text-sm mt-0.5 font-normal">
                  Log out of your account on this device.
                </p>
              </div>
            </div>

            {/* Right: Log out Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-[0.98] border border-[#D7E0E3] shadow-xs text-sm font-semibold text-[#15313C] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: LOG OUT OF YOUR ACCOUNT? (matches Screenshot 4) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with dark blur */}
          <div
            className="fixed inset-0 bg-[#15313C]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsLogoutModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-[32px] p-7 sm:p-9 max-w-[430px] w-full shadow-[0_25px_60px_rgba(21,49,60,0.22)] border border-[#EAF0F2] z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Lime Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] flex items-center justify-center text-[#15313C] mb-5">
              <LogOut className="w-5 h-5 stroke-[2]" />
            </div>

            {/* Heading & Subtitle */}
            <h3 className="text-[22px] font-bold text-[#15313C] tracking-tight leading-tight">
              Log out of your account?
            </h3>
            <p className="text-[#5A737E] text-sm mt-2 font-normal leading-relaxed">
              You will need to log in again to open lectures, sections, and the
              Exam Bank.
            </p>

            {/* Buttons Row (Cancel & Log out) */}
            <div className="flex items-center justify-center gap-3 mt-7">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-sm font-semibold text-[#15313C] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-6 py-2.5 rounded-full bg-[#15313C] hover:bg-[#112730] active:scale-[0.98] text-[#CCEB74] text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
