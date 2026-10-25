import React from 'react';
import { Outlet } from 'react-router-dom';
import DspPoster from '../features/auth/components/DspPoster';

export const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden select-none bg-[#F5F8F9]"
      style={{
        background: 'radial-gradient(circle at 10% 25%, #F1FBD2 0%, rgba(245, 248, 249, 0.45) 45%, #F5F8F9 75%), radial-gradient(circle at 48% 88%, #F1FBD2 0%, rgba(245, 248, 249, 0.5) 45%, #F5F8F9 80%)'
      }}
    >
      {/* Soft ambient lime glow layers using #F1FBD2 & #CCEB74 */}
      <div className="absolute -top-16 -left-16 w-[450px] h-[450px] bg-[#F1FBD2]/70 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 left-1/4 w-[500px] h-[500px] bg-[#CCEB74]/20 blur-[110px] rounded-full pointer-events-none" />

      {/* Main Dual Card Layout */}
      <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 items-stretch relative z-10 my-auto">
        {/* Left Card: DSP Course Poster */}
        <div className="w-full flex">
          <DspPoster />
        </div>

        {/* Right Card: Login Card */}
        <div className="w-full flex">
          <div className="w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(21,49,60,0.035)] border border-[#EAF0F2] p-8 sm:p-11 flex flex-col justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
