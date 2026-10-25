import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

import { MOCK_LECTURES } from '../data/mockLectures';

/**
 * Lectures List Page matching Figma screen/lectures/list/default
 * Features:
 * - Clean title & subtitle with sample placeholders indicator
 * - Rounded search bar & filter tabs (All, Video, PDF)
 * - 3-column lecture card grid with book icons, lecture numbers, titles, and media badges
 */
export const LecturesListPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Video' | 'PDF'

  const lecturesData = MOCK_LECTURES;

  const filteredLectures = lecturesData.filter((lec) => {
    const matchesSearch =
      lec.number.toLowerCase().includes(search.toLowerCase()) ||
      lec.title.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'Video') return lec.hasVideo;
    if (activeFilter === 'PDF') return lec.hasPdf;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#15313C] tracking-tight">
            Lectures
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B8089] mt-1.5 leading-relaxed">
            Watch the video lectures and open the lecture PDF files.
          </p>
        </div>

        {/* Top Right Sample Placeholders Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs text-[#6B8089] font-medium self-start sm:self-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15313C]" />
          <span>Sample placeholders</span>
        </div>
      </div>

      {/* 2. TOOLBAR: SEARCH & FILTER TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left: Rounded Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B8089]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lectures..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-[#D7E0E3] bg-white text-xs sm:text-sm text-[#15313C] placeholder:text-[#6B8089] outline-none focus:border-[#15313C] shadow-xs transition-colors"
          />
        </div>

        {/* Right: Filter Buttons (All, Video, PDF) */}
        <div className="inline-flex items-center rounded-full bg-white border border-[#D7E0E3] p-1 shadow-xs self-start sm:self-center">
          {['All', 'Video', 'PDF'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CCEB74] text-[#15313C] shadow-xs'
                    : 'text-[#6B8089] hover:text-[#15313C]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LECTURES GRID (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
        {filteredLectures.map((lecture) => {
          // Direct navigation to external link video page for external lectures
          const targetPath =
            lecture.videoType === 'external'
              ? `/lectures/${lecture.id}/video`
              : `/lectures/${lecture.id}`;

          return (
            <Link
              key={lecture.id}
              to={targetPath}
              className="bg-white rounded-[24px] sm:rounded-[26px] p-6 border border-[#EAF0F2] shadow-[0_10px_30px_rgba(21,49,60,0.035)] hover:shadow-[0_16px_40px_rgba(21,49,60,0.065)] transition-all flex flex-col justify-between min-h-[175px] sm:min-h-[185px] group cursor-pointer text-left no-underline"
            >
              {/* Top Row: Lime Icon Box & Circle Arrow Button */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317]">
                  <BookOpen className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div
                  className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#15313C] group-hover:bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105"
                  title={`Open ${lecture.number}`}
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Middle: Lecture Number & Title */}
              <div className="mt-3 mb-4">
                <p className="text-xs font-semibold text-[#6B8089] tracking-wide mb-1">
                  {lecture.number}
                </p>
                <h3 className="text-xl font-bold text-[#15313C] tracking-tight">
                  {lecture.title}
                </h3>
              </div>

              {/* Bottom Row: Badges (Video, PDF) */}
              <div className="flex items-center gap-2">
                {lecture.hasVideo && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                    Video
                  </span>
                )}
                {lecture.hasPdf && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                    PDF
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State if Search yields no results */}
      {filteredLectures.length === 0 && (
        <div className="bg-white/80 rounded-[24px] border border-dashed border-[#B5C2C7] p-10 text-center">
          <BookOpen className="w-8 h-8 text-[#6B8089] mx-auto mb-2 stroke-[1.5]" />
          <p className="text-sm font-semibold text-[#15313C]">No lectures found</p>
          <p className="text-xs text-[#6B8089] mt-1">
            Try adjusting your search query or switching the filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setActiveFilter('All');
            }}
            className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#15313C] text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default LecturesListPage;
