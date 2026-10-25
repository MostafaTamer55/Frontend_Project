import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card, { CardBody } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/forms/SearchBar';
import { Award, Clock, FileQuestion, CheckCircle2, Play } from 'lucide-react';

const mockExams = [
  { id: 'midterm-2024', title: 'DSP Midterm Exam 2024 (Comprehensive)', type: 'Midterm', questions: 25, duration: '90m', difficulty: 'Hard', attempts: '1 Attempt Left' },
  { id: 'quiz-ztransform', title: 'Chapter Quiz: Z-Transform & ROC Stability', type: 'Quiz', questions: 10, duration: '20m', difficulty: 'Medium', attempts: 'Unlimited' },
  { id: 'practice-fft', title: 'Practice Test: FFT Decimation & Complexity', type: 'Practice', questions: 15, duration: '35m', difficulty: 'Medium', attempts: 'Unlimited' },
  { id: 'quiz-filters', title: 'Chapter Quiz: FIR & IIR Filter Architectures', type: 'Quiz', questions: 12, duration: '25m', difficulty: 'Hard', attempts: 'Unlimited' },
  { id: 'final-mock', title: 'Spring 2025 Final Exam Simulation (All Chapters)', type: 'Mock Final', questions: 40, duration: '120m', difficulty: 'Comprehensive', attempts: '2 Attempts' },
];

export const ExamBankPage = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredExams = mockExams.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || e.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 08 Exam Bank</Badge>
          <span className="font-medium">Assigned to: Developer 4 (Assessment Engine)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/exams</code></span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Exam Bank & Assessments</h2>
          <p className="text-xs text-slate-500 mt-1">Timed quizzes, past midterm assessments, and final exam simulations</p>
        </div>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search exams by name or category..."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Midterm', 'Quiz', 'Practice', 'Mock Final'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === tab
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map(exam => (
          <Card key={exam.id} hoverable>
            <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="brand" size="sm">{exam.type}</Badge>
                  <span className="text-xs text-slate-400 font-medium">{exam.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Covers frequency-domain theorems, pole-zero stability, and digital signal reconstruction.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {exam.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="w-3.5 h-3.5" /> {exam.questions} Qs
                  </span>
                </div>
                <Link to={`/exams/${exam.id}`}>
                  <Button variant="primary" size="sm" icon={Play}>
                    Start Exam
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

export default ExamBankPage;
