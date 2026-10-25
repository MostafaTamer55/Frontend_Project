import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Layers,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';

/**
 * Dashboard Page matching Figma screen/dashboard/first-time-user
 * Features:
 * - Panoramic DSP Hero Banner with 3D fluted slats and "Browse lectures ->"
 * - Floating rounded Search bar
 * - 3 Category Cards: Lectures (dark ink #15313C), Sections (white), Exam Bank (white)
 * - "Continue learning" dashed placeholder state with "Browse lectures ->"
 */
export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // 18 3D fluted vertical cylindrical ribs for the panoramic hero banner
  const flutedBars = [
    { opacity: 0.2, limeAlpha: 0.12 },
    { opacity: 0.28, limeAlpha: 0.2 },
    { opacity: 0.38, limeAlpha: 0.32 },
    { opacity: 0.48, limeAlpha: 0.45 },
    { opacity: 0.6, limeAlpha: 0.6 },
    { opacity: 0.72, limeAlpha: 0.72 },
    { opacity: 0.84, limeAlpha: 0.82 },
    { opacity: 0.94, limeAlpha: 0.92 },
    { opacity: 1.0, limeAlpha: 1.0 },
    { opacity: 0.96, limeAlpha: 0.95 },
    { opacity: 0.92, limeAlpha: 0.9 },
    { opacity: 0.88, limeAlpha: 0.85 },
    { opacity: 0.84, limeAlpha: 0.8 },
    { opacity: 0.8, limeAlpha: 0.75 },
    { opacity: 0.76, limeAlpha: 0.7 },
    { opacity: 0.72, limeAlpha: 0.65 },
    { opacity: 0.68, limeAlpha: 0.6 },
    { opacity: 0.64, limeAlpha: 0.55 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. PANORAMIC HERO BANNER */}
      <div className="relative w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#15313C] shadow-[0_20px_50px_rgba(21,49,60,0.16)] p-7 sm:p-10 min-h-[310px] sm:min-h-[330px] flex flex-col justify-between select-none">
        {/* Background Artwork: 3D Fluted Acoustic Slats on Right Half */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#15313C]" />

          {/* Ambient Mist & Lime Spotlight */}
          <div className="absolute top-0 right-10 w-[350px] h-[350px] bg-[#3A5560]/30 blur-[70px] rounded-full" />
          <div className="absolute bottom-0 right-16 w-[380px] h-[320px] bg-[#CCEB74]/30 blur-[80px] rounded-full" />
          <div className="absolute bottom-8 right-32 w-[220px] h-[200px] bg-[#F1FBD2]/25 blur-[50px] rounded-full" />

          {/* Vertical Ribs Container */}
          <div className="absolute right-0 top-0 bottom-0 w-[58%] flex items-stretch justify-end gap-[5px] sm:gap-[6px] pr-4 sm:pr-8">
            {flutedBars.map((bar, index) => (
              <div
                key={index}
                className="relative h-full flex-1 min-w-[8px] max-w-[20px] rounded-full overflow-hidden"
                style={{
                  opacity: bar.opacity,
                  background: `linear-gradient(180deg, 
                    #15313C 0%, 
                    #1b3d4a 18%, 
                    #255462 34%, 
                    #3A5560 48%, 
                    rgba(204, 235, 116, ${bar.limeAlpha}) 68%, 
                    #CCEB74 86%, 
                    #d8f08f 100%)`,
                  boxShadow:
                    'inset 1px 0 1px rgba(255, 255, 255, 0.35), inset -1.5px 0 2px rgba(0, 0, 0, 0.65)',
                }}
              >
                <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-white/30 to-transparent" />
                <div className="absolute inset-y-0 left-[20%] w-[20%] bg-white/10" />
              </div>
            ))}
          </div>

          {/* Left Contrast Gradient Overlay */}
          <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#15313C] via-[#15313C]/95 to-transparent z-0" />
        </div>

        {/* Top Text: Department Title in lime */}
        <div className="relative z-10">
          <p className="text-xs sm:text-[13px] font-medium text-[#CCEB74] tracking-wide">
            Welcome • Electronics and Communications Engineering
          </p>
        </div>

        {/* Content: Course Title, Badges & Instructor */}
        <div className="relative z-10 mt-6 sm:mt-8">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.08] mb-4">
            Digital Signal<br />Processing
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-medium text-white/95 bg-[#1f424f] border border-white/10 shadow-sm">
              DSP
            </span>
            <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-medium text-white/95 bg-[#1f424f] border border-white/10 shadow-sm">
              ECE 28
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-normal text-[#B5C2C7]">
              Instructor
            </span>
            <span className="block text-sm sm:text-[15px] font-bold text-white mt-0.5">
              Dr. Abeer Tawokol
            </span>
          </div>
        </div>

        {/* Bottom Right Floating Action: Browse lectures -> */}
        <Link
          to="/lectures"
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-[#CCEB74] hover:bg-[#bce64f] active:scale-[0.98] text-[#15313C] font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-md transition-all z-20 cursor-pointer"
        >
          <span>Browse lectures</span>
          <ArrowRight className="w-4 h-4 stroke-[2.25]" />
        </Link>
      </div>

      {/* 2. FLOATING SEARCH BAR */}
      <div className="max-w-2xl mx-auto -mt-6 sm:-mt-8 relative z-20 px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_12px_35px_rgba(21,49,60,0.08)] border border-[#EAF0F2] px-5 sm:px-6 py-3 sm:py-3.5 flex items-center gap-3 transition-shadow focus-within:shadow-[0_16px_40px_rgba(21,49,60,0.12)]">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B8089] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures, sections, and exam resources..."
            className="w-full text-xs sm:text-sm text-[#15313C] placeholder:text-[#6B8089] outline-none bg-transparent"
          />
        </div>
      </div>

      {/* 3. THREE CATEGORY CARDS (Lectures, Sections, Exam Bank) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
        {/* Card 1: Lectures (Active Dark Card #15313C) */}
        <div className="bg-[#15313C] rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 shadow-[0_15px_40px_rgba(21,49,60,0.16)] flex flex-col justify-between min-h-[220px] sm:min-h-[240px] text-white relative group">
          {/* Top Row: Icon and Lime Round Arrow Button */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#CCEB74]">
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <Link
              to="/lectures"
              className="w-10 h-10 rounded-full bg-[#CCEB74] hover:bg-[#bce64f] text-[#15313C] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
              title="Open Lectures"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.25]" />
            </Link>
          </div>

          {/* Middle: Title & Subtitle */}
          <div className="mt-4 mb-5">
            <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight">
              Lectures
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Watch the video lectures and open the lecture PDF files.
            </p>
          </div>

          {/* Bottom Pills */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/95 border border-white/10">
              Video
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/95 border border-white/10">
              PDF
            </span>
          </div>
        </div>

        {/* Card 2: Sections (White Card) */}
        <div className="bg-white rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.04)] flex flex-col justify-between min-h-[220px] sm:min-h-[240px] relative group hover:shadow-[0_16px_40px_rgba(21,49,60,0.07)] transition-shadow">
          {/* Top Row: Icon and Round Arrow Button */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317]">
              <Layers className="w-5 h-5 stroke-[1.75]" />
            </div>
            <Link
              to="/sections"
              className="w-10 h-10 rounded-full border border-slate-200 text-[#15313C] hover:bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105"
              title="Open Sections"
            >
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>

          {/* Middle: Title & Subtitle */}
          <div className="mt-4 mb-5">
            <h3 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight">
              Sections
            </h3>
            <p className="text-xs text-[#6B8089] mt-1.5 leading-relaxed">
              Practical section PDFs, with a video link on some.
            </p>
          </div>

          {/* Bottom Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
              PDF
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
              Optional video link
            </span>
          </div>
        </div>

        {/* Card 3: Exam Bank (White Card) */}
        <div className="bg-white rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.04)] flex flex-col justify-between min-h-[220px] sm:min-h-[240px] relative group hover:shadow-[0_16px_40px_rgba(21,49,60,0.07)] transition-shadow">
          {/* Top Row: Icon and Round Arrow Button */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317]">
              <FolderArchive className="w-5 h-5 stroke-[1.75]" />
            </div>
            <Link
              to="/exams"
              className="w-10 h-10 rounded-full border border-slate-200 text-[#15313C] hover:bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105"
              title="Open Exam Bank"
            >
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>

          {/* Middle: Title & Subtitle */}
          <div className="mt-4 mb-5">
            <h3 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight">
              Exam Bank
            </h3>
            <p className="text-xs text-[#6B8089] mt-1.5 leading-relaxed">
              Question PDFs for each lecture or topic, and past exam papers.
            </p>
          </div>

          {/* Bottom Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
              Question PDFs
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
              Past exams
            </span>
          </div>
        </div>
      </div>

      {/* 4. CONTINUE LEARNING SECTION */}
      <div className="pt-2">
        <h2 className="text-2xl font-bold text-[#15313C] tracking-tight mb-4">
          Continue learning
        </h2>

        {/* Dashed Border Empty State Card */}
        <div className="w-full rounded-[24px] sm:rounded-[26px] border border-dashed border-[#B5C2C7] bg-white/70 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#15313C]">
                Nothing opened yet
              </h4>
              <p className="text-xs sm:text-[13px] text-[#6B8089] mt-0.5 leading-relaxed max-w-xl">
                Lectures, sections, and exam resources you open will appear here, so you can pick up where you left off.
              </p>
            </div>
          </div>

          {/* Action button */}
          <Link
            to="/lectures"
            className="bg-[#CCEB74] hover:bg-[#bce64f] active:scale-[0.98] text-[#15313C] font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span>Browse lectures</span>
            <ArrowRight className="w-4 h-4 stroke-[2.25]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
