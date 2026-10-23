import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  FolderArchive,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import { getLectureById } from '../data/mockLectures';

/**
 * Dedicated Video Page matching:
 * - Case 1: Platform Video Player (Figma screen/lectures/video/player)
 * - Case 2: External Google Drive Link (Figma screen/lectures/video/external-link)
 */
export const LectureVideoPage = () => {
  const { lectureId = '2' } = useParams();
  const currentId = parseInt(lectureId, 10) || 2;
  const lecture = getLectureById(currentId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38); // 38% progress for demo

  // Current, Previous, and Next lecture calculations
  const currentNumberStr = lecture.number || `Lecture ${currentId.toString().padStart(2, '0')}`;
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 8 ? currentId + 1 : null;

  const prevNumberStr = prevId ? `Lecture ${prevId.toString().padStart(2, '0')}` : null;
  const nextNumberStr = nextId ? `Lecture ${nextId.toString().padStart(2, '0')}` : null;

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="pt-1">
        {/* Breadcrumb nav */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] mb-2">
          <Link to="/lectures" className="hover:text-[#15313C] transition-colors">
            Lectures
          </Link>
          <span>/</span>
          <Link to={`/lectures/${currentId}`} className="hover:text-[#15313C] transition-colors">
            {currentNumberStr}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#15313C]">Video</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#15313C] tracking-tight">
          Lecture title
        </h1>
      </div>

      {/* 2. MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (8 cols): Either External Drive Video (Case 2) or Platform Player (Case 1) */}
        {lecture.videoType === 'external' ? (
          /* Case 2: External Link hosted on Drive (Figma screen/lectures/video/external-link) */
          <div className="lg:col-span-8 bg-[#15313C] rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 shadow-[0_20px_50px_rgba(21,49,60,0.18)] flex flex-col justify-between min-h-[380px] sm:min-h-[440px] relative select-none">
            {/* Top-Left: Rounded Container with ExternalLink icon */}
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#CCEB74]">
              <ExternalLink className="w-5 h-5 stroke-[2]" />
            </div>

            {/* Bottom Content */}
            <div className="mt-auto pt-16 max-w-lg">
              <span className="text-xs font-semibold text-[#CCEB74] tracking-wide block mb-1">
                External video
              </span>
              <h2 className="text-2xl sm:text-[34px] font-bold text-white tracking-tight leading-tight mb-2">
                This video opens in a new tab
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-6">
                The lecture video is hosted outside the platform.
              </p>

              {/* Open Video Pill Button */}
              <a
                href={lecture.externalDriveUrl || 'https://drive.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Open video</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.25]" />
              </a>
            </div>
          </div>
        ) : (
          /* Case 1: Video hosted on platform (Figma screen/lectures/video/player) */
          <div className="lg:col-span-8 bg-[#15313C] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(21,49,60,0.18)] flex flex-col justify-between min-h-[380px] sm:min-h-[440px] relative select-none">
            {/* Main Video Viewport */}
            <div className="relative flex-1 flex items-center justify-center p-6">
              {/* Center Big Lime Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] flex items-center justify-center transition-all shadow-[0_10px_35px_rgba(204,235,116,0.4)] cursor-pointer group z-20"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none ml-1 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Simulated DSP background waveform / video preview visuals */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-24 flex items-center justify-center gap-1.5 px-8">
                  {[40, 65, 30, 85, 95, 60, 45, 80, 50, 70, 90, 40, 55, 75, 35, 90, 65, 45].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full bg-[#CCEB74] transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                        style={{ height: `${val}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Video Control Bar at Bottom */}
            <div className="bg-[#0f242c]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-t border-white/10 flex items-center gap-3 sm:gap-4 relative z-20">
              {/* Play/Pause icon button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-[#CCEB74] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {/* Timeline Scrubber Bar */}
              <div
                className="flex-1 h-1.5 bg-white/20 hover:bg-white/30 rounded-full relative cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.clientX - rect.left) / rect.width) * 100;
                  setProgress(Math.min(Math.max(pos, 0), 100));
                }}
              >
                <div
                  className="h-full bg-[#CCEB74] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow-sm absolute right-0 top-1/2 -translate-y-1/2 -mr-1.5" />
                </div>
              </div>

              {/* Time Indicator */}
              <span className="text-[11px] font-mono text-slate-300 whitespace-nowrap">
                {isPlaying ? '18:24 / 45:10' : '00:00 / 00:00'}
              </span>

              {/* Volume Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={() => alert('Fullscreen toggled')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right Column (4 cols): Information & Action Sidebar Card */}
        <div className="lg:col-span-4 bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex flex-col justify-between">
          <div>
            {/* Lecture Meta Header */}
            <div className="mb-6">
              <span className="block text-xs font-semibold text-[#6B8089]">
                {currentNumberStr}
              </span>
              <h2 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight mt-0.5">
                Lecture title
              </h2>

              {/* Pills: Video & PDF */}
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  Video
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  PDF
                </span>
              </div>
            </div>

            {/* Action Item Rows */}
            <div className="space-y-3">
              {/* Row 1: Lecture PDF */}
              <Link
                to={`/lectures/${currentId}/pdf`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FileText className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Lecture PDF
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      Preview or download
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 2: Related questions */}
              <Link
                to="/exams"
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FolderArchive className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Related questions
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      Exam Bank
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 3: Back to lecture */}
              <Link
                to={`/lectures/${currentId}`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <ArrowLeft className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Back to lecture
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      {currentNumberStr}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION: PREVIOUS & NEXT LECTURE BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Previous Lecture Capsule */}
        {prevId ? (
          <Link
            to={`/lectures/${prevId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center gap-3.5 shadow-xs hover:bg-white transition-all group"
          >
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#15313C] flex items-center justify-center group-hover:bg-slate-50 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Previous lecture
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {prevNumberStr} • Lecture title
              </span>
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center gap-3.5 opacity-60 cursor-not-allowed">
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#6B8089] flex items-center justify-center shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <span className="block text-[11px] text-[#6B8089]">First lecture</span>
              <span className="block text-xs font-medium text-[#6B8089]">No previous lecture</span>
            </div>
          </div>
        )}

        {/* Next Lecture Capsule */}
        {nextId ? (
          <Link
            to={`/lectures/${nextId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center justify-between gap-3.5 shadow-xs hover:bg-white transition-all group text-right"
          >
            <div className="overflow-hidden text-left sm:text-right flex-1">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Next lecture
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {nextNumberStr} • Lecture title
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#CCEB74] group-hover:bg-[#bfee50] text-[#15313C] flex items-center justify-center transition-colors shadow-xs shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[2.25]" />
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center justify-between gap-3.5 opacity-60 cursor-not-allowed">
            <div className="text-right flex-1">
              <span className="block text-[11px] text-[#6B8089]">Last lecture</span>
              <span className="block text-xs font-medium text-[#6B8089]">Course syllabus completed</span>
            </div>
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#6B8089] flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureVideoPage;
