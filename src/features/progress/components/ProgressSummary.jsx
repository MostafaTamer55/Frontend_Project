import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useProgress } from '../services/progressService';

/**
 * ProgressSummary Component
 * Pixel-perfect implementation of the Dashboard Progress section matching Figma / user design.
 * Supports:
 * - Dynamic / reactive client state (when user listens to a lecture, it updates to 'Watched')
 * - Direct prop injection (`data`) for future backend integration without any code modification
 */
export const ProgressSummary = ({
  data: propData,
  showDetailsLink = false,
  onSelectLectures,
}) => {
  const { progressData: hookData, toggleLectureWatched } = useProgress(propData);
  const data = propData || hookData;

  const overall = data?.overallCompletion ?? 78;
  const lectures = data?.lectures || [];
  const sections = data?.sections || [];
  const exams = data?.exams || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6 sm:space-y-7 w-full select-none">
      {/* 1. OVERVIEW ANALYTICS HERO BANNER */}
      <div className="relative w-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-[#15313C] shadow-[0_20px_50px_rgba(21,49,60,0.18)] p-6 sm:p-8 lg:p-9 text-white">
        {/* Top Content Row: Tag & Title on Left, Overall Completion Box on Right */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6">
          {/* Left Side: Pill Tag + Main Course Title */}
          <div className="max-w-2xl">
            {/* Pill Tag */}
            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#CCEB74] bg-[#1E3F4C] border border-[#CCEB74]/15 uppercase">
              OVERVIEW ANALYTICS
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight mt-3 sm:mt-4 leading-snug">
              {data.courseTitle || 'Digital Signal Processing - Progress Summary'}
            </h1>
          </div>

          {/* Right Side: Overall Completion Metric Box */}
          <div className="bg-[#1C3E4C]/90 border border-white/5 rounded-2xl px-6 sm:px-8 py-3.5 sm:py-4 text-center sm:text-right shrink-0 shadow-inner">
            <span className="block text-xs sm:text-[13px] font-normal text-slate-300 mb-0.5">
              Overall Completion
            </span>
            <span className="block text-3xl sm:text-4xl font-extrabold text-[#CCEB74] tracking-tight">
              {overall}%
            </span>
          </div>
        </div>

        {/* Bottom Horizontal Progress Bar */}
        <div className="mt-8 sm:mt-10">
          <div className="w-full h-3 sm:h-3.5 bg-[#2B4754] rounded-full overflow-hidden p-[2px]">
            <div
              className="h-full bg-[#CCEB74] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(204,235,116,0.3)]"
              style={{ width: `${Math.min(Math.max(overall, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. THREE PROGRESS COLUMNS (Lectures, Sections, Exams & Quizzes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* COLUMN 1: Lectures Progress */}
        <div className="bg-[#EFF7CD] rounded-[24px] sm:rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(21,49,60,0.03)] border border-[#E2EEB5]/80 flex flex-col justify-between">
          <div>
            {/* Header: Title and Black Pill Badge (Clickable to view breakdown) */}
            <div
              onClick={onSelectLectures}
              className={`flex items-center justify-between mb-4 sm:mb-5 ${
                onSelectLectures
                  ? 'cursor-pointer group hover:opacity-90 transition-opacity'
                  : ''
              }`}
              title={onSelectLectures ? 'Click to view Lectures Progress Breakdown' : undefined}
            >
              <h3 className="text-base sm:text-lg font-bold text-[#15313C] tracking-tight group-hover:underline">
                Lectures Progress
              </h3>
              <span className="px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold bg-[#15313C] text-white shadow-xs group-hover:bg-[#1c3e4c] transition-colors">
                {stats.lecturesCompletionBadge || '85% Completed'}
              </span>
            </div>

            {/* List of Lectures Cards */}
            <div className="space-y-3">
              {lectures.map((lec) => {
                const isWatched = lec.status === 'watched';
                const isInProgress = lec.status === 'in_progress';

                return (
                  <div
                    key={lec.id || lec.number}
                    className="bg-white rounded-[16px] sm:rounded-[18px] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 shadow-xs border border-white/90 hover:shadow-sm transition-all"
                  >
                    {/* Lecture Title Link */}
                    <Link
                      to={`/lectures/${lec.id || '1'}/video`}
                      className="text-xs sm:text-sm font-semibold text-[#15313C] hover:text-[#3A5560] transition-colors truncate"
                      title="Open lecture video"
                    >
                      {lec.title}
                    </Link>

                    {/* Status Pill / Indicator */}
                    <div className="shrink-0 flex items-center">
                      {isWatched ? (
                        <button
                          type="button"
                          onClick={() => toggleLectureWatched(lec.id)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#15803d] cursor-pointer hover:opacity-80 transition-opacity"
                          title="Click to toggle status for testing"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Watched</span>
                        </button>
                      ) : isInProgress ? (
                        <button
                          type="button"
                          onClick={() => toggleLectureWatched(lec.id)}
                          className="text-xs sm:text-sm font-bold text-[#D97706] cursor-pointer hover:opacity-80 transition-opacity"
                          title="Click to toggle status for testing"
                        >
                          In Progress
                        </button>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-slate-400">
                          Not Started
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Sections Progress */}
        <div className="bg-[#EFF7CD] rounded-[24px] sm:rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(21,49,60,0.03)] border border-[#E2EEB5]/80 flex flex-col justify-between">
          <div>
            {/* Header: Title and Black Pill Badge */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="text-base sm:text-lg font-bold text-[#15313C] tracking-tight">
                Sections Progress
              </h3>
              <span className="px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold bg-[#15313C] text-white shadow-xs">
                {stats.sectionsCompletionBadge || '70% Completed'}
              </span>
            </div>

            {/* List of Sections Cards */}
            <div className="space-y-3">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-white rounded-[16px] sm:rounded-[18px] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 shadow-xs border border-white/90 hover:shadow-sm transition-all"
                >
                  <Link
                    to="/sections"
                    className="text-xs sm:text-sm font-semibold text-[#15313C] hover:text-[#3A5560] transition-colors truncate"
                  >
                    {sec.title}
                  </Link>

                  <span className="text-xs sm:text-sm font-medium text-[#6B8089] shrink-0">
                    {sec.statusText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Exams & Quizzes */}
        <div className="bg-[#EFF7CD] rounded-[24px] sm:rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(21,49,60,0.03)] border border-[#E2EEB5]/80 flex flex-col justify-between">
          <div>
            {/* Header: Title and Black Pill Badge */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="text-base sm:text-lg font-bold text-[#15313C] tracking-tight">
                Exams & Quizzes
              </h3>
              <span className="px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold bg-[#15313C] text-white shadow-xs">
                {stats.examsAvgBadge || 'Avg: 88%'}
              </span>
            </div>

            {/* List of Exams Cards */}
            <div className="space-y-3">
              {exams.map((exam, idx) => (
                <div
                  key={exam.id || idx}
                  className="bg-white rounded-[16px] sm:rounded-[18px] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 shadow-xs border border-white/90 hover:shadow-sm transition-all"
                >
                  <Link
                    to="/exams"
                    className="text-xs sm:text-sm font-semibold text-[#15313C] hover:text-[#3A5560] transition-colors truncate"
                  >
                    {exam.title}
                  </Link>

                  <span className="text-xs sm:text-sm font-bold text-[#15313C] shrink-0">
                    {exam.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
