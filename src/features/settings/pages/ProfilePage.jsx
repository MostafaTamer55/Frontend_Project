import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const INITIAL_PROFILE = {
  fullName: 'Student name',
  email: 'name@example.com',
  course: 'Digital Signal Processing (DSP)',
  cohort: 'ECE 28',
  instructor: 'Dr. Abeer Tawakol',
  initials: 'SN',
  tags: ['DSP', 'ECE 28'],
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Load saved profile or fallback to exact Figma 10 screenshot defaults
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('dsp_profile_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_PROFILE;
  });

  // Modal / Drawer state for the Settings button
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync formData whenever profile changes or modal opens
  useEffect(() => {
    setFormData(profile);
  }, [profile, isSettingsOpen]);

  const handleOpenSettings = () => {
    setFormData(profile);
    setIsSettingsOpen(true);
    setSaveSuccess(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    setSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Automatically derive initials if fullName is changed
      if (name === 'fullName') {
        const parts = value.trim().split(/\s+/);
        if (parts.length >= 2) {
          updated.initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1 && parts[0].length > 0) {
          updated.initials = parts[0].substring(0, 2).toUpperCase();
        }
      }
      if (name === 'cohort') {
        updated.tags = ['DSP', value || 'ECE 28'];
      }
      return updated;
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setProfile(formData);
    try {
      localStorage.setItem('dsp_profile_data', JSON.stringify(formData));
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const handleResetToDefault = () => {
    setFormData(INITIAL_PROFILE);
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem('dsp_profile_data');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000);
  };

  const handleUseActiveAccount = () => {
    if (currentUser) {
      const nameParts = (currentUser.name || 'Student Name').split(' ');
      const initials =
        nameParts.length >= 2
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : (currentUser.name || 'SN').substring(0, 2).toUpperCase();

      const synced = {
        fullName: currentUser.name || 'Student name',
        email: currentUser.email || 'name@example.com',
        course: 'Digital Signal Processing (DSP)',
        cohort: 'ECE 28',
        instructor: 'Dr. Abeer Tawakol',
        initials: initials || 'SN',
        tags: ['DSP', 'ECE 28'],
      };
      setFormData(synced);
      setProfile(synced);
      localStorage.setItem('dsp_profile_data', JSON.stringify(synced));
    }
  };

  return (
    <div className="relative w-full max-w-[1080px] mx-auto py-2 sm:py-6 animate-in fade-in duration-200">
      {/* Page Header (Title + Subtitle + Sample placeholders badge) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7 sm:mb-9">
        <div>
          <h1 className="text-[38px] sm:text-[44px] font-bold text-[#15313C] tracking-tight leading-tight">
            Profile
          </h1>
          <p className="text-[#5A737E] text-[15px] sm:text-base mt-1 font-normal">
            Your basic account details.
          </p>
        </div>

        {/* Top-Right Badge: Sample placeholders */}
        <div className="self-start sm:self-auto sm:mt-1">
          <button
            type="button"
            onClick={handleOpenSettings}
            title="Click to customize profile details"
            className="group inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-[#DCE5E8] shadow-[0_2px_8px_rgba(21,49,60,0.03)] text-xs text-[#5A737E] font-medium transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E748B] group-hover:scale-125 transition-transform" />
            <span>Sample placeholders</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] lg:grid-cols-[335px_1fr] gap-6 items-stretch">
        {/* Left Dark Teal Card */}
        <div className="bg-[#15313C] rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 text-white flex flex-col justify-between shadow-[0_20px_45px_rgba(21,49,60,0.16)] relative min-h-[380px] sm:min-h-[420px]">
          <div>
            {/* Circular Avatar */}
            <div className="w-[74px] h-[74px] rounded-full bg-[#D4EF70] text-[#15313C] flex items-center justify-center font-bold text-[24px] tracking-tight shadow-xs select-none">
              {profile.initials || 'SN'}
            </div>

            {/* Student Name & Email */}
            <div className="mt-8 sm:mt-10">
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight">
                {profile.fullName}
              </h2>
              <p className="text-[#8DA6AF] text-sm mt-1 font-normal break-all">
                {profile.email}
              </p>
            </div>

            {/* Badges / Tags */}
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {profile.tags && profile.tags.length > 0 ? (
                profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1F3E4A] text-white border border-white/5 tracking-wide"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1F3E4A] text-white border border-white/5">
                    DSP
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1F3E4A] text-white border border-white/5">
                    ECE 28
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Settings Button */}
          <div className="mt-10 sm:mt-14">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#D4EF70] hover:bg-[#c8e55e] active:scale-[0.98] text-[#15313C] font-bold text-sm transition-all shadow-[0_4px_14px_rgba(212,239,112,0.25)] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#15313C] stroke-[2.2]" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Right White Card: Account Details */}
        <div className="bg-white/95 backdrop-blur-sm rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 border border-[#EAF0F2] shadow-[0_15px_35px_rgba(21,49,60,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-[21px] sm:text-[22px] font-bold text-[#15313C] tracking-tight mb-6 sm:mb-8">
              Account details
            </h2>

            {/* Rows with divider lines */}
            <div className="divide-y divide-[#EAF0F2]">
              {/* Row 1: Full name */}
              <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                  Full name
                </span>
                <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                  {profile.fullName}
                </span>
              </div>

              {/* Row 2: Email */}
              <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                  Email
                </span>
                <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0 break-all">
                  {profile.email}
                </span>
              </div>

              {/* Row 3: Course */}
              <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                  Course
                </span>
                <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                  {profile.course}
                </span>
              </div>

              {/* Row 4: Cohort */}
              <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                  Cohort
                </span>
                <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                  {profile.cohort}
                </span>
              </div>

              {/* Row 5: Instructor */}
              <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#15313C] font-semibold text-sm w-44 shrink-0">
                  Instructor
                </span>
                <span className="text-[#15313C] text-sm font-normal mt-1 sm:mt-0">
                  {profile.instructor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Settings Modal / Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#15313C]/40 backdrop-blur-sm transition-opacity"
            onClick={handleCloseSettings}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-[0_25px_60px_rgba(21,49,60,0.2)] border border-[#EAF0F2] max-w-lg w-full p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EAF7C6] flex items-center justify-center text-[#15313C]">
                  <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#15313C]">
                    Profile Settings
                  </h3>
                  <p className="text-xs text-[#6B8089]">
                    Modify account information and presentation details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseSettings}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#15313C] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between gap-2 py-3 border-b border-slate-100 text-xs">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3A5560] hover:text-[#15313C] hover:bg-slate-50 transition-colors cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Figma Sample</span>
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={handleUseActiveAccount}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF7C6]/70 text-[#15313C] hover:bg-[#EAF7C6] transition-colors cursor-pointer font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sync Active User ({currentUser.name})</span>
                </button>
              )}
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A5560] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C] text-[#15313C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A5560] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C] text-[#15313C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3A5560] mb-1">
                    Course Name
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C] text-[#15313C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A5560] mb-1">
                    Cohort
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="cohort"
                      value={formData.cohort}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C] text-[#15313C]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A5560] mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#15313C] focus:ring-1 focus:ring-[#15313C] text-[#15313C]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseSettings}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-[#15313C] text-[#CCEB74] hover:bg-[#112730] transition-colors cursor-pointer shadow-xs"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#CCEB74]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
