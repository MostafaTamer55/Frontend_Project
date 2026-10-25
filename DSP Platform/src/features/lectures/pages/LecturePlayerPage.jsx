import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Video,
  Play,
  FileText,
  Eye,
  Download,
  FolderArchive,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

import { getLectureById } from '../data/mockLectures';

/**
 * Lecture Details / Player Page matching Figma screen/lectures/details/default
 * Features:
 * - Breadcrumbs: Lectures / Lecture XX
 * - Large dark video lecture card (#15313C) with central lime play button (#CCEB74)
 * - Lecture PDF card with Preview and Download buttons
 * - Related questions card with Open question files button
 * - Bottom Previous and Next lecture navigation capsules
 */
export const LecturePlayerPage = () => {
  const { lectureId = '2' } = useParams();
  const currentId = parseInt(lectureId, 10) || 2;
  const lecture = getLectureById(currentId);

  // Pad lecture number for display (e.g. "Lecture 02")
  const currentNumberStr = lecture.number || `Lecture ${currentId.toString().padStart(2, '0')}`;
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 8 ? currentId + 1 : null;

  const prevNumberStr = prevId ? `Lecture ${prevId.toString().padStart(2, '0')}` : null;
  const nextNumberStr = nextId ? `Lecture ${nextId.toString().padStart(2, '0')}` : null;

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          {/* Breadcrumb row */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] mb-2">
            <Link to="/lectures" className="hover:text-[#15313C] transition-colors">
              Lectures
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#15313C]">{currentNumberStr}</span>
          </nav>

          {/* Heading & Subtitle */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#15313C] tracking-tight">
            Lecture title
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B8089] mt-1.5 leading-relaxed">
            Optional lecture description appears here.
          </p>
        </div>

        {/* Top Right Sample Placeholders Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs text-[#6B8089] font-medium self-start sm:self-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15313C]" />
          <span>Sample placeholders</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID (Case 3: No-Video vs Case 1/2: Video) */}
      {!lecture.hasVideo ? (
        /* Case 3: No-Video / PDF-Only Details (Figma screen/lectures/details/no-video) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: Lecture PDF Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex flex-col justify-between min-h-[300px]">
            {/* Top: File Icon & Meta */}
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] mb-5">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <p className="text-xs font-semibold text-[#6B8089]">Lecture PDF</p>
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#15313C] tracking-tight mt-1 mb-3">
                Lecture title
              </h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                PDF
              </span>
            </div>

            {/* Bottom Actions: Preview & Download Buttons */}
            <div className="flex items-center gap-3 mt-8">
              <Link
                to={`/lectures/${currentId}/pdf`}
                className="bg-[#15313C] hover:bg-[#112730] text-white py-2.5 px-6 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 stroke-[2]" />
                <span>Preview</span>
              </Link>

              <button
                type="button"
                onClick={() => alert(`Downloading slides for ${currentNumberStr}...`)}
                className="bg-white border border-[#D7E0E3] hover:bg-slate-50 text-[#15313C] py-2.5 px-6 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2]" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Right Card: Related questions */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex flex-col justify-between min-h-[300px]">
            {/* Top Row: Icon & Title */}
            <div>
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                  <FolderArchive className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight">
                  Related questions
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#6B8089] leading-relaxed">
                Question files for this lecture.
              </p>
            </div>

            {/* Action: Open question files -> */}
            <div className="mt-8">
              <Link
                to="/exams"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-[#15313C] bg-white border border-[#D7E0E3] hover:bg-slate-50 shadow-xs transition-colors"
              >
                <span>Open question files</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Case 1 & 2: Large Video Lecture Card + Stacked Right Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7 cols): Large Dark Video Lecture Card */}
          <div className="lg:col-span-7 bg-[#15313C] rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_20px_50px_rgba(21,49,60,0.16)] flex flex-col justify-between min-h-[350px] sm:min-h-[380px] relative overflow-hidden select-none">
            {/* Top Row: Video Icon Box and Video Pill Badge */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#CCEB74]">
                <Video className="w-5 h-5 stroke-[1.75]" />
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/95 border border-white/10 shadow-sm">
                Video
              </span>
            </div>

            {/* Center-Right Large Glowing Lime Play Button */}
            <div className="absolute top-1/2 right-8 sm:right-12 -translate-y-1/2 z-10">
              <Link
                to={`/lectures/${currentId}/video`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] flex items-center justify-center transition-all shadow-[0_10px_30px_rgba(204,235,116,0.35)] cursor-pointer group"
                title="Watch Video Lecture"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none ml-1 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Subtle ambient glow in bottom-left */}
            <div className="absolute -bottom-10 -left-10 w-[240px] h-[240px] bg-[#3A5560]/25 blur-[60px] rounded-full pointer-events-none" />

            {/* Bottom Left Content */}
            <div className="relative z-10 mt-auto pt-16 max-w-md">
              <span className="text-xs font-medium text-[#CCEB74] tracking-wide block">
                {lecture.videoType === 'external' ? 'External video' : 'Video lecture'}
              </span>
              <h2 className="text-2xl sm:text-[32px] font-bold text-white tracking-tight leading-tight mt-1">
                Watch the lecture
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 mt-1.5 leading-relaxed">
                {lecture.videoType === 'external'
                  ? 'Opens external video hosted outside the platform.'
                  : 'Opens the video for this lecture.'}
              </p>

              {/* Watch Video Pill Button */}
              <div className="mt-4">
                <Link
                  to={`/lectures/${currentId}/video`}
                  className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-[0.98] text-[#15313C] font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#15313C] stroke-none" />
                  <span>Watch video</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Stack of Two White Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 sm:gap-6">
            {/* Card 1: Lecture PDF */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex-1 flex flex-col justify-between">
              {/* Top Row: Icon & Text */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                  <FileText className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B8089]">Lecture PDF</p>
                  <h3 className="text-lg sm:text-xl font-bold text-[#15313C] tracking-tight mt-0.5">
                    Lecture title
                  </h3>
                </div>
              </div>

              {/* Bottom Actions: Preview & Download Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-2">
                <Link
                  to={`/lectures/${currentId}/pdf`}
                  className="bg-[#15313C] hover:bg-[#112730] text-white py-2.5 px-5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 stroke-[2]" />
                  <span>Preview</span>
                </Link>

                <button
                  type="button"
                  onClick={() => alert(`Downloading slides for ${currentNumberStr}...`)}
                  className="bg-white border border-[#D7E0E3] hover:bg-slate-50 text-[#15313C] py-2.5 px-5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2]" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Card 2: Related Questions */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex-1 flex flex-col justify-between">
              {/* Top Row: Icon & Title */}
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FolderArchive className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#15313C] tracking-tight">
                    Related questions
                  </h3>
                </div>
                <p className="text-xs text-[#6B8089] leading-relaxed">
                  Question files for this lecture.
                </p>
              </div>

              {/* Action: Open question files -> */}
              <div className="mt-5">
                <Link
                  to="/exams"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#15313C] bg-white border border-[#D7E0E3] hover:bg-slate-50 shadow-xs transition-colors"
                >
                  <span>Open question files</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM NAVIGATION: PREVIOUS & NEXT LECTURE BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Previous Lecture Capsule */}
        {prevId ? (
          <Link
            to={`/lectures/${prevId}`}
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
            to={`/lectures/${nextId}`}
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

export default LecturePlayerPage;
