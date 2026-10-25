import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardBody } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { Terminal, Code2, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const mockSections = [
  { id: '1', num: '01', title: 'Lab 1: Python NumPy & Scipy for Discrete Signals', env: 'Python / Jupyter', duration: '1h 30m', solved: true, difficulty: 'Beginner' },
  { id: '2', num: '02', title: 'Lab 2: Sampling Continuous Signals & Aliasing Verification', env: 'MATLAB / Python', duration: '2h', solved: true, difficulty: 'Intermediate' },
  { id: '3', num: '03', title: 'Lab 3: Z-Transform Analysis & Frequency Response in Pole-Zero Plane', env: 'Python Scipy.signal', duration: '2h', solved: true, difficulty: 'Intermediate' },
  { id: '4', num: '04', title: 'Lab 4: Fast Fourier Transform (FFT) Benchmarking & Spectral Leakage', env: 'Python / NumPy', duration: '1h 45m', solved: false, difficulty: 'Advanced' },
  { id: '5', num: '05', title: 'Lab 5: FIR Filter Design via Windowing (Hamming & Blackman)', env: 'MATLAB fdatool', duration: '2h 15m', solved: false, difficulty: 'Advanced' },
  { id: '6', num: '06', title: 'Lab 6: Real-time Audio Filtering & IIR Chebyshev Design', env: 'Python PyAudio', duration: '2h 30m', solved: false, difficulty: 'Advanced' },
];

export const SectionsListPage = () => {
  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 07 Sections</Badge>
          <span className="font-medium">Assigned to: Developer 3 (Lectures & Sections)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/sections</code></span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">Practical Sections & Labs</h2>
        <p className="text-xs text-slate-500 mt-1">Hands-on recitations, simulation starter code, and algorithm implementations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockSections.map(sec => (
          <Card key={sec.id} hoverable>
            <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent-50 text-accent-700 border border-accent-200">
                      SEC {sec.num}
                    </span>
                    <Badge variant={sec.solved ? 'success' : 'neutral'} size="sm">
                      {sec.solved ? 'Submitted' : 'Pending'}
                    </Badge>
                  </div>
                  <Badge variant="neutral" size="sm">{sec.difficulty}</Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-brand-600" /> {sec.env}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {sec.duration}
                </span>
                <Link to={`/sections/${sec.id}`}>
                  <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                    Open Lab
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionsListPage;
