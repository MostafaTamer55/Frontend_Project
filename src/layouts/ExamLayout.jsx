import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, Radio } from 'lucide-react';
import Button from '../components/common/Button';

export const ExamLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Exam Header */}
      <header className="h-16 bg-slate-950/90 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/exams')}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            icon={ArrowLeft}
          >
            Exit Exam
          </Button>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-sm text-white">
              DSP Assessment Runner
            </span>
          </div>
        </div>

        {/* Status / Timer Indicator placeholder */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Session Active</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Mode</span>
          </div>
        </div>
      </header>

      {/* Main Full-screen Assessment Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ExamLayout;
