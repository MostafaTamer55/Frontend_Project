import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LecturesProgressBreakdown Component
 * Displays the detailed progress breakdown for all lectures
 * Matching Figma design screenshot:
 * - "Back to Progress Overview" navigation link
 * - "Lectures Progress Breakdown" title
 * - White cards for each lecture with numbered badges, duration, progress track, and status badges
 * - "Total Watch Time: 18.5 / 22 hrs" bottom summary pill
 */
export const LecturesProgressBreakdown = ({ onBack, lecturesData: propLectures }) => {
  // Initial default static data matching the screenshot (no backend created)
  const defaultLectures = [
    {
      id: '1',
      numberStr: '01',
      title: 'Lecture 1: Introduction to Signal Processing & Sampling',
      meta: 'Duration: 1h 45m • Completed on Oct 02, 2026',
      progressPercent: 100,
      badgeText: '100% Watched',
      badgeVariant: 'watched', // 'watched' | 'in_progress' | 'not_started'
      numberVariant: 'dark', // 'dark' | 'lime' | 'gray'
    },
    {
      id: '2',
      numberStr: '02',
      title: 'Lecture 2: Analog-to-Digital Conversion & Quantization',
      meta: 'Duration: 2h 10m • Completed on Oct 06, 2026',
      progressPercent: 100,
      badgeText: '100% Watched',
      badgeVariant: 'watched',
      numberVariant: 'dark',
    },
    {
      id: '3',
      numberStr: '03',
      title: 'Lecture 3: Discrete-Time Fourier Transform (DTFT)',
      meta: 'Duration: 1h 55m • Remaining: 35m',
      progressPercent: 65,
      badgeText: '65% Watched',
      badgeVariant: 'in_progress',
      numberVariant: 'lime',
    },
    {
      id: '4',
      numberStr: '04',
      title: 'Lecture 4: Z-Transform Analysis & System Functions',
      meta: 'Duration: 2h 00m • Not Started',
      progressPercent: 0,
      badgeText: 'Not Started',
      badgeVariant: 'not_started',
      numberVariant: 'gray',
    },
  ];

  const lectures = propLectures || defaultLectures;

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* 1. TOP NAV: BACK TO PROGRESS OVERVIEW */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#6B8089] hover:text-[#15313C] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Progress Overview</span>
        </button>

        {/* PAGE TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#15313C] tracking-tight mt-3">
          Lectures Progress Breakdown
        </h1>
      </div>

      {/* 2. LECTURES LIST CARDS */}
      <div className="space-y-3.5 sm:space-y-4">
        {lectures.map((lec) => {
          // Number badge styles
          let numberBadgeClasses = 'bg-[#15313C] text-[#CCEB74]';
          if (lec.numberVariant === 'lime') {
            numberBadgeClasses = 'bg-[#CCEB74] text-[#15313C]';
          } else if (lec.numberVariant === 'gray') {
            numberBadgeClasses = 'bg-[#F0F4F6] text-[#8EA1A9]';
          }

          // Status badge styles
          let statusBadgeClasses = 'bg-[#EAF5F0] text-[#15803d] font-semibold';
          if (lec.badgeVariant === 'in_progress') {
            statusBadgeClasses = 'bg-[#FEF6EB] text-[#B45309] font-bold';
          } else if (lec.badgeVariant === 'not_started') {
            statusBadgeClasses = 'bg-[#F5F8F9] text-[#8EA1A9] font-medium';
          }

          // Title color for not started
          const titleClasses =
            lec.badgeVariant === 'not_started'
              ? 'text-[#526B76] font-semibold'
              : 'text-[#15313C] font-bold';

          return (
            <div
              key={lec.id || lec.numberStr}
              className="bg-white rounded-[20px] sm:rounded-[22px] p-5 sm:p-6 border border-[#EAF0F2] shadow-[0_4px_20px_rgba(21,49,60,0.025)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:shadow-[0_8px_25px_rgba(21,49,60,0.04)] transition-all"
            >
              {/* Left Side: Number Pill + Lecture Title and Meta */}
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                {/* Number Badge Box */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-xs ${numberBadgeClasses}`}
                >
                  {lec.numberStr}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <Link
                    to={`/lectures/${lec.id}/video`}
                    className={`block text-sm sm:text-base ${titleClasses} tracking-tight hover:opacity-85 transition-opacity truncate`}
                  >
                    {lec.title}
                  </Link>
                  <p className="text-xs text-[#6B8089] mt-0.5 sm:mt-1 truncate">
                    {lec.meta}
                  </p>
                </div>
              </div>

              {/* Right Side: Mini Progress Bar + Status Badge */}
              <div className="flex items-center gap-4 sm:gap-5 self-end sm:self-center shrink-0">
                {/* Mini Progress Bar */}
                <div className="w-24 sm:w-32 h-2 rounded-full bg-[#EBF1F3] overflow-hidden p-0">
                  {lec.progressPercent > 0 && (
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        lec.progressPercent === 100
                          ? 'bg-[#15313C]'
                          : 'bg-[#CCEB74]'
                      }`}
                      style={{ width: `${lec.progressPercent}%` }}
                    />
                  )}
                </div>

                {/* Status Pill Badge */}
                <span
                  className={`px-3 sm:px-3.5 py-1 rounded-full text-xs shrink-0 whitespace-nowrap ${statusBadgeClasses}`}
                >
                  {lec.badgeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. BOTTOM SUMMARY PILL */}
      <div className="flex justify-end pt-2">
        <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-[#15313C] bg-[#EFF7CD] border border-[#DCECA2]/70 shadow-xs">
          <span>Total Watch Time: 18.5 / 22 hrs</span>
        </div>
      </div>
    </div>
  );
};

export default LecturesProgressBreakdown;
