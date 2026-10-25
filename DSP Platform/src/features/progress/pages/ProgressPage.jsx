import React from 'react';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import ProgressBar from '../../../components/common/ProgressBar';
import { TrendingUp, Award, Calendar, CheckCircle, BarChart3, Clock } from 'lucide-react';

export const ProgressPage = () => {
  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 09 Progress</Badge>
          <span className="font-medium">Assigned to: Developer 2 (Dashboard & Progress)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/progress</code></span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">Learning Progress & Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">Track your topic mastery, study velocity, and exam score trajectories</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Syllabus</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">68.5%</p>
            <ProgressBar value={68.5} max={100} color="brand" className="mt-3" />
            <p className="text-xs text-slate-400 mt-2">18 of 24 modules mastered</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Time Invested</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">34h 15m</p>
            <ProgressBar value={80} max={100} color="accent" className="mt-3" />
            <p className="text-xs text-slate-400 mt-2">Target: 40h per semester</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment Average</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">92.4%</p>
            <ProgressBar value={92.4} max={100} color="emerald" className="mt-3" />
            <p className="text-xs text-slate-400 mt-2">4 Quizzes & 1 Midterm</p>
          </CardBody>
        </Card>
      </div>

      {/* Topic Mastery Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery Matrix</CardTitle>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          {[
            { topic: 'Discrete-Time Signals & LTI Systems', score: 95, status: 'Mastered' },
            { topic: 'Z-Transform & Pole-Zero Stability', score: 90, status: 'Mastered' },
            { topic: 'Discrete Fourier Transform (DFT) & DTFT', score: 82, status: 'Proficient' },
            { topic: 'Fast Fourier Transform (FFT) Algorithms', score: 70, status: 'In Progress' },
            { topic: 'FIR & IIR Digital Filter Design', score: 45, status: 'Learning' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{item.topic}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={item.score > 85 ? 'success' : item.score > 60 ? 'brand' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                  <span className="font-bold text-slate-900">{item.score}%</span>
                </div>
              </div>
              <ProgressBar value={item.score} max={100} color={item.score > 85 ? 'emerald' : 'brand'} size="sm" />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProgressPage;
