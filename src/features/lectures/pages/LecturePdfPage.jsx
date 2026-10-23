import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Download,
} from 'lucide-react';

/**
 * Dedicated PDF Viewer Page matching Figma screen/lectures/pdf-viewer (media_1792763199316.png)
 * Features:
 * - Breadcrumbs: Lectures / Lecture XX / PDF
 * - Floating PDF Toolbar:
 *   - "Back to Lecture" pill button
 *   - Lecture title, subtitle, and PDF badge
 *   - Pagination controls (< 1/N >)
 *   - Zoom controls (- 100% +)
 *   - Download button (#CCEB74 lime)
 * - Large elevated rounded viewer card with "PDF viewer area" tag
 * - Pixel-perfect document sheet skeleton matching Figma artwork
 */
export const LecturePdfPage = () => {
  const { lectureId = '2' } = useParams();
  const currentId = parseInt(lectureId, 10) || 2;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 'N'; // Matches Figma design "1/N"
  const [zoomLevel, setZoomLevel] = useState(100);

  const currentNumberStr = `Lecture ${currentId.toString().padStart(2, '0')}`;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleDownload = () => {
    alert(`Downloading PDF for ${currentNumberStr}...`);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] pt-1">
        <Link to="/lectures" className="hover:text-[#15313C] transition-colors">
          Lectures
        </Link>
        <span>/</span>
        <Link to={`/lectures/${currentId}`} className="hover:text-[#15313C] transition-colors">
          {currentNumberStr}
        </Link>
        <span>/</span>
        <span className="font-bold text-[#15313C]">PDF</span>
      </nav>

      {/* 2. FLOATING PDF TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#EAF0F2] shadow-[0_8px_30px_rgba(21,49,60,0.04)] py-2.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back to Lecture Button */}
        <Link
          to={`/lectures/${currentId}`}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 text-xs font-bold text-[#15313C] transition-colors shadow-2xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Lecture</span>
        </Link>

        {/* Center-Left: Lecture Title & PDF Pill Badge */}
        <div className="flex flex-col justify-center min-w-0 mr-auto sm:ml-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-[#15313C] truncate">
              {currentNumberStr} · Lecture title
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#F5F8F9] border border-[#D7E0E3] text-[#15313C]">
              PDF
            </span>
          </div>
          <p className="text-[11px] text-[#6B8089]">Lecture PDF</p>
        </div>

        {/* Right Controls: Pagination, Zoom, and Download */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Pagination Controls (< 1/N >) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-[#15313C] px-1 whitespace-nowrap">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls (- 100% +) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-xs font-semibold text-[#15313C] px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] font-bold text-xs py-2 px-4 sm:px-5 rounded-full inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ml-1"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.25]" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* 3. PDF VIEWER MAIN DISPLAY AREA */}
      <div className="w-full bg-white/70 backdrop-blur-sm rounded-[32px] sm:rounded-[36px] border border-[#EAF0F2] shadow-[0_15px_45px_rgba(21,49,60,0.035)] p-6 sm:p-10 min-h-[760px] relative overflow-hidden flex flex-col items-center">
        {/* Top-Left Badge: PDF viewer area */}
        <div className="self-start mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8ED]/70 border border-[#D0DFE5] text-[11px] font-medium text-[#2F5968] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F5968]" />
          <span>PDF viewer area</span>
        </div>

        {/* Centered Document Sheet (Exact Skeleton matching Figma artwork) */}
        <div
          className="w-full max-w-[580px] sm:max-w-[620px] bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-[#EAF0F2] p-8 sm:p-14 min-h-[720px] transition-transform duration-200 select-none"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header Block Placeholder */}
          <div className="space-y-2.5 mb-8">
            <div className="h-6 w-3/5 bg-[#E1EAF0] rounded-md" />
            <div className="h-3.5 w-2/5 bg-[#E1EAF0] rounded-sm" />
          </div>

          {/* Top Paragraph Lines Placeholder (5 lines) */}
          <div className="space-y-2.5 mb-8">
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-[94%] bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-[65%] bg-[#E1EAF0] rounded-full" />
          </div>

          {/* Central Diagram / Figure Box Placeholder (clean rounded box) */}
          <div className="w-full h-44 sm:h-52 bg-[#F3F7F9] border border-[#DEE7ED] rounded-2xl mb-8" />

          {/* Bottom Paragraph Lines Placeholder (2 groups matching Figma) */}
          <div className="space-y-2.5">
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
            <div className="h-2.5 w-[65%] bg-[#E1EAF0] rounded-full" />

            <div className="pt-2 space-y-2.5">
              <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
              <div className="h-2.5 w-full bg-[#E1EAF0] rounded-full" />
              <div className="h-2.5 w-[95%] bg-[#E1EAF0] rounded-full" />
              <div className="h-2.5 w-[60%] bg-[#E1EAF0] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePdfPage;
