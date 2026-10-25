import React from 'react';

/**
 * Exact DSP Course Poster with the precise Figma background artwork and palette:
 * - Direct high-resolution background asset (/dsp-poster-bg.jpg)
 * - Exact ink/900 (#15313C) and accent/lime (#CCEB74) tokens
 * - "Electronics and Communications Engineering"
 * - "Digital Signal Processing"
 * - Badges: "DSP" and "ECE 28"
 * - Instructor: "Dr. Abeer Tawokol"
 */
export const DspPoster = () => {
  return (
    <div className="relative w-full min-h-[500px] lg:min-h-[550px] rounded-[32px] overflow-hidden bg-[#15313C] shadow-[0_20px_45px_rgba(21,49,60,0.18)] flex flex-col justify-between p-8 sm:p-9 select-none">
      {/* Exact High-Resolution Figma Artwork Background */}
      <img
        src="/dsp-poster-bg.jpg"
        alt="DSP Course Artwork Background"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* TOP HEADER: Department Title in exact #CCEB74 (accent/lime) */}
      <div className="relative z-10">
        <p className="text-[11px] sm:text-[12px] font-medium text-[#CCEB74] tracking-wide">
          Electronics and Communications Engineering
        </p>
      </div>

      {/* BOTTOM SECTION: Course Title, Badges & Instructor */}
      <div className="relative z-10 mt-auto pt-16">
        {/* Title */}
        <h1 className="text-3xl sm:text-[40px] font-bold text-white tracking-tight leading-[1.1] mb-5">
          Digital Signal<br />Processing
        </h1>

        {/* Badges: DSP & ECE 28 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-medium text-white/95 bg-[#17333d]/85 backdrop-blur-md border border-white/10 shadow-sm">
            DSP
          </span>
          <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-medium text-white/95 bg-[#17333d]/85 backdrop-blur-md border border-white/10 shadow-sm">
            ECE 28
          </span>
        </div>

        {/* Instructor */}
        <div>
          <span className="block text-[11px] font-normal text-[#B5C2C7]">
            Instructor
          </span>
          <span className="block text-sm sm:text-[15px] font-bold text-white mt-0.5">
            Dr. Abeer Tawokol
          </span>
        </div>
      </div>
    </div>
  );
};

export default DspPoster;
